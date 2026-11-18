import type { Theme } from '@/context/theme-context';

export interface ViewportSnapshot {
  theme: Theme;
  canvas: HTMLCanvasElement;
  scale: number;
  key: string;
}

export const THEME_BACKGROUNDS: Record<Theme, string> = {
  light: '#f4efe7',
  dark: '#151b1e',
};

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/** Device-pixel scale capped to keep GPU textures and html2canvas captures responsive. */
export function renderScale(): number {
  // 1x keeps html2canvas captures short; the ink overlay is only visible for < 1s.
  return isCoarsePointer() ? 1 : Math.min(window.devicePixelRatio || 1, 1);
}

/** Identifies the current viewport layout + scroll position that a snapshot covers. */
export function viewportKey(scale: number): string {
  const docEl = document.documentElement;
  const x = Math.round(window.scrollX);
  const y = Math.round(window.scrollY);
  return `${docEl.clientWidth}x${docEl.clientHeight}@${x},${y}@${scale}`;
}

/**
 * Captures the currently visible viewport of the live page via lazy-loaded html2canvas.
 * Only the "from" state is needed because the WebGL2 ink shader cuts directly through
 * to the live destination DOM underneath.
 */
export async function captureViewport(
  theme: Theme,
  scale: number,
  maxTextureSize: number,
): Promise<ViewportSnapshot> {
  const docEl = document.documentElement;
  const width = Math.max(1, docEl.clientWidth);
  const height = Math.max(1, docEl.clientHeight);
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const key = viewportKey(scale);

  const safeScale = Math.min(scale, maxTextureSize / width, maxTextureSize / height);
  const { default: html2canvas } = await import('html2canvas');

  const canvas = await html2canvas(document.body, {
    scale: safeScale,
    backgroundColor: THEME_BACKGROUNDS[theme],
    x: scrollX,
    y: scrollY,
    width,
    height,
    scrollX,
    scrollY,
    windowWidth: width,
    windowHeight: height,
    logging: false,
    useCORS: true,
    onclone: (clonedDoc) => {
      clonedDoc.documentElement.classList.remove('theme-transition', 'ink-instant-flip');
      clonedDoc.documentElement.style.scrollBehavior = 'auto';

      // Freeze CSS keyframe animations (e.g. route-enter, hero-content-enter) at rest
      // so the fresh clone iframe never restarts fade-in keyframes at opacity: 0.
      const freeze = clonedDoc.createElement('style');
      freeze.textContent =
        '*, *::before, *::after { animation: none !important; transition: none !important; }';
      clonedDoc.head.append(freeze);

      // Re-apply scroll position after disabling smooth scrolling so html2canvas
      // measures the exact scrolled viewport rather than easing from y = 0.
      clonedDoc.defaultView?.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    },
  });

  return { theme, canvas, scale: safeScale, key };
}
