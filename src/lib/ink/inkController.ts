import type { Theme } from '@/context/theme-context';
import { captureViewport, renderScale, viewportKey, type ViewportSnapshot } from './capture';
import { INK_PARAMS, InkRenderer, type InkFrame } from './renderer';

export interface InkOrigin {
  x: number;
  y: number;
}

const SPREAD = {
  growth: 0.7,
  cleanupFrom: 0.45,
  cleanupReach: 0.4,
  cleanupPow: 2,
} as const;

const FADE_OUT_MS = 150;
const IDLE_DEBOUNCE_MS = 900;
const PRELOAD_BRAND_ASSETS = ['/brand/logo-dv-light.png', '/brand/logo-dv-dark.png'];

function easePower3Out(t: number): number {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

function farthestCorner(point: InkOrigin): number {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  return (
    Math.max(
      Math.hypot(point.x, point.y),
      Math.hypot(width - point.x, point.y),
      Math.hypot(point.x, height - point.y),
      Math.hypot(width - point.x, height - point.y),
    ) + 4
  );
}

function randomSeed(): InkFrame['seed'] {
  return {
    x: Math.random() * 64 - 32,
    y: Math.random() * 64 - 32,
    angle: Math.random() * Math.PI * 2,
  };
}

function isCaptureIgnored(node: Node): boolean {
  const element = node instanceof Element ? node : node.parentElement;
  if (!element) return false;
  if (
    element.closest(
      '[data-html2canvas-ignore], [data-ink-ignore-mutations], .html2canvas-container, .opening-intro',
    )
  ) {
    return true;
  }
  return (
    element instanceof HTMLElement && !element.isConnected && element.style.visibility === 'hidden'
  );
}

function affectsCapture(record: MutationRecord): boolean {
  if (!record.target.isConnected || isCaptureIgnored(record.target)) return false;
  if (record.type !== 'childList') return true;
  return [...record.addedNodes, ...record.removedNodes].some((node) => !isCaptureIgnored(node));
}

function preloadBrandMonograms(): void {
  for (const src of PRELOAD_BRAND_ASSETS) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  }
}

/**
 * Manages the WebGL2 Ink Bleed overlay canvas, viewport snapshot pre-warming,
 * and requestAnimationFrame transition lifecycle for ThemeProvider.
 */
export class InkTransitionController {
  private readonly renderer: InkRenderer | null;
  private readonly canvas: HTMLCanvasElement;
  private readonly events = new AbortController();
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private readonly getTheme: () => Theme;

  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private rootObserver: MutationObserver | null = null;

  private captureGen = 0;
  private inFlightCapture: Promise<ViewportSnapshot | null> | null = null;
  private inFlightKey = '';
  private inFlightTheme: Theme | null = null;
  private debounceTimer = 0;
  private idleHandle: number | null = null;
  private rafId = 0;
  private fadeTimer = 0;

  private animating = false;
  private toggling = false;
  private fading = false;
  private fontsReady = false;
  private disposed = false;

  constructor(getTheme: () => Theme) {
    this.getTheme = getTheme;

    const canvas = document.createElement('canvas');
    canvas.className = 'ink-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('data-html2canvas-ignore', '');
    document.body.append(canvas);
    this.canvas = canvas;

    this.renderer = InkRenderer.create(canvas);
    if (!this.renderer) return;

    preloadBrandMonograms();
    this.renderer.resize(renderScale());
    this.renderer.watchContext(
      () => {
        this.captureGen++;
        this.cancelAnimation();
      },
      () => this.invalidate(),
      this.events.signal,
    );

    this.reducedMotion.addEventListener(
      'change',
      () => {
        if (this.reducedMotion.matches) {
          this.cancelAnimation();
        } else {
          this.scheduleCapture(IDLE_DEBOUNCE_MS);
        }
      },
      { signal: this.events.signal },
    );

    window.addEventListener(
      'resize',
      () => {
        this.renderer?.resize(renderScale());
        this.invalidate();
      },
      { signal: this.events.signal },
    );

    window.addEventListener(
      'scroll',
      () => {
        if (this.animating && !this.fading) {
          this.startFadeOut();
        }
        this.invalidate();
      },
      { passive: true, signal: this.events.signal },
    );

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.invalidate());
      this.resizeObserver.observe(document.body);
    }

    this.mutationObserver = new MutationObserver((records) => {
      if (records.some(affectsCapture)) {
        this.invalidate();
      }
    });
    this.mutationObserver.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'src', 'srcset', 'data-project-reveal', 'open'],
    });

    this.rootObserver = new MutationObserver(() => {
      if (!document.documentElement.dataset.openingIntro) {
        this.scheduleCapture(IDLE_DEBOUNCE_MS);
      }
    });
    this.rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-opening-intro'],
    });

    document.fonts.addEventListener('loadingdone', () => this.invalidate(), {
      signal: this.events.signal,
    });
    void document.fonts.ready.then(() => {
      if (this.disposed) return;
      this.fontsReady = true;
      this.scheduleCapture(IDLE_DEBOUNCE_MS);
    });
  }

  get isBusy(): boolean {
    return this.animating || this.toggling;
  }

  invalidate(): void {
    if (this.disposed || !this.renderer) return;
    this.captureGen++;
    this.renderer.invalidate();
    this.scheduleCapture(IDLE_DEBOUNCE_MS);
  }

  /**
   * Attempts an Ink Bleed WebGL2 transition from `origin`.
   * Returns `true` when the transition is handled (or in progress), `false` if the caller
   * should fall back to View Transitions / instant theme swap.
   */
  async toggle(origin: InkOrigin | undefined, to: Theme, applyTheme: () => void): Promise<boolean> {
    if (this.disposed || this.isBusy) return true;
    const renderer = this.renderer;
    if (!renderer || renderer.isLost || this.reducedMotion.matches) {
      return false;
    }

    const fromTheme = this.getTheme();
    const scale = renderScale();
    const key = viewportKey(scale);

    this.toggling = true;
    try {
      if (!renderer.hasValid(fromTheme, key)) {
        const snap = await this.captureFor(fromTheme, scale, key);
        if (this.disposed || renderer.isLost || this.reducedMotion.matches || !snap) {
          return false;
        }
        renderer.upload(snap);
      }

      const center = origin ?? { x: window.innerWidth / 2, y: 40 };
      const maxDist = farthestCorner(center);
      const seed = randomSeed();
      const duration = INK_PARAMS.duration;

      const buildFrame = (elapsedSec: number): InkFrame => {
        const linear = Math.min(1, elapsedSec / duration);
        const progress = easePower3Out(linear);
        const ramp = Math.max(0, (linear - SPREAD.cleanupFrom) / (1 - SPREAD.cleanupFrom));
        const cleanup =
          ramp ** SPREAD.cleanupPow * maxDist * SPREAD.cleanupReach +
          Math.max(0, (linear - 0.97) / 0.03) * maxDist;
        return {
          to,
          center,
          progress,
          radius: progress * maxDist * SPREAD.growth,
          cleanup,
          time: elapsedSec,
          seed,
        };
      };

      renderer.resize(scale);
      if (!renderer.draw(buildFrame(0))) {
        return false;
      }

      this.animating = true;
      this.fading = false;
      window.clearTimeout(this.fadeTimer);
      cancelAnimationFrame(this.rafId);

      // Present frame 0 ("from" snapshot) and commit the live DOM flip in the same paint task.
      this.canvas.style.transition = '';
      this.canvas.style.opacity = '1';
      this.canvas.classList.add('is-active');
      applyTheme();

      const startTime = performance.now();
      const step = (now: number) => {
        if (this.disposed || !this.animating) return;
        const elapsedSec = Math.max(0, (now - startTime) / 1000);
        if (!renderer.draw(buildFrame(elapsedSec))) {
          this.cancelAnimation();
          return;
        }
        if (elapsedSec >= duration) {
          this.startFadeOut();
          return;
        }
        this.rafId = requestAnimationFrame(step);
      };

      this.rafId = requestAnimationFrame(step);
      return true;
    } catch (error) {
      console.warn('[ink] transition fallback triggered:', error);
      this.cancelAnimation();
      return false;
    } finally {
      this.toggling = false;
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.captureGen++;
    this.events.abort();
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.rootObserver?.disconnect();
    window.clearTimeout(this.debounceTimer);
    window.clearTimeout(this.fadeTimer);
    if (this.idleHandle !== null && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(this.idleHandle);
      this.idleHandle = null;
    }
    this.cancelAnimation();
    this.renderer?.dispose();
    this.canvas.remove();
  }

  private startFadeOut(): void {
    if (!this.animating || this.fading) return;
    this.fading = true;
    cancelAnimationFrame(this.rafId);
    this.canvas.style.transition = `opacity ${FADE_OUT_MS}ms linear`;
    this.canvas.style.opacity = '0';
    window.clearTimeout(this.fadeTimer);
    this.fadeTimer = window.setTimeout(() => {
      this.hideOverlay();
      this.scheduleCapture(IDLE_DEBOUNCE_MS);
    }, FADE_OUT_MS + 20);
  }

  private hideOverlay(): void {
    this.animating = false;
    this.fading = false;
    this.canvas.classList.remove('is-active');
    this.canvas.style.transition = '';
    this.canvas.style.opacity = '1';
  }

  private cancelAnimation(): void {
    cancelAnimationFrame(this.rafId);
    window.clearTimeout(this.fadeTimer);
    this.hideOverlay();
  }

  private scheduleCapture(delayMs: number): void {
    if (this.disposed || !this.renderer || this.renderer.isLost || this.reducedMotion.matches) {
      return;
    }
    window.clearTimeout(this.debounceTimer);
    if (this.idleHandle !== null && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(this.idleHandle);
      this.idleHandle = null;
    }

    this.debounceTimer = window.setTimeout(() => {
      if (this.disposed) return;
      if ('requestIdleCallback' in window) {
        this.idleHandle = window.requestIdleCallback(
          () => {
            this.idleHandle = null;
            void this.warmCache();
          },
          { timeout: 600 },
        );
      } else {
        void this.warmCache();
      }
    }, delayMs);
  }

  private async warmCache(): Promise<void> {
    const renderer = this.renderer;
    if (
      this.disposed ||
      !this.fontsReady ||
      !renderer ||
      renderer.isLost ||
      this.reducedMotion.matches ||
      this.animating ||
      this.toggling ||
      document.hidden ||
      document.documentElement.dataset.openingIntro === 'playing'
    ) {
      return;
    }

    const theme = this.getTheme();
    const scale = renderScale();
    const key = viewportKey(scale);
    if (renderer.hasValid(theme, key)) return;

    const gen = ++this.captureGen;
    const snap = await this.captureFor(theme, scale, key);
    if (
      !snap ||
      this.disposed ||
      renderer.isLost ||
      this.animating ||
      this.toggling ||
      gen !== this.captureGen
    ) {
      return;
    }
    if (snap.key !== viewportKey(renderScale()) || theme !== this.getTheme()) {
      this.scheduleCapture(IDLE_DEBOUNCE_MS);
      return;
    }
    renderer.upload(snap);
  }

  private captureFor(theme: Theme, scale: number, key: string): Promise<ViewportSnapshot | null> {
    if (this.inFlightCapture && this.inFlightKey === key && this.inFlightTheme === theme) {
      return this.inFlightCapture;
    }
    const renderer = this.renderer;
    if (!renderer) return Promise.resolve(null);

    const promise = captureViewport(theme, scale, renderer.maxTextureSize)
      .catch((error) => {
        console.warn('[ink] viewport capture failed:', error);
        return null;
      })
      .finally(() => {
        if (this.inFlightCapture === promise) {
          this.inFlightCapture = null;
          this.inFlightKey = '';
          this.inFlightTheme = null;
        }
      });

    this.inFlightCapture = promise;
    this.inFlightKey = key;
    this.inFlightTheme = theme;
    return promise;
  }
}
