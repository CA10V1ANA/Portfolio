import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { InkTransitionController } from '@/lib/ink/inkController';
import { ThemeContext, type Theme } from './theme-context';

const THEME_COLORS: Record<Theme, string> = {
  light: '#f4efe7',
  dark: '#151b1e',
};

function getInitialTheme(): Theme {
  // Always open in light when entering the site; dark is toggled per visit.
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const themeRef = useRef<Theme>(theme);
  themeRef.current = theme;
  const transitioning = useRef(false);
  const inkRef = useRef<InkTransitionController | null>(null);

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.colorScheme = theme;

    const metaThemeColor = window.document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEME_COLORS[theme]);
    }
  }, [theme]);

  useEffect(() => {
    // Touch/mobile devices use the instant GPU View Transitions reveal directly to avoid
    // blocking the mobile CPU with html2canvas DOM snapshots on scroll and tap.
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    const controller = new InkTransitionController(() => themeRef.current);
    inkRef.current = controller;
    return () => {
      controller.dispose();
      if (inkRef.current === controller) {
        inkRef.current = null;
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: (origin?: { x: number; y: number }) => {
        if (transitioning.current || inkRef.current?.isBusy) return;
        const current = themeRef.current;
        const next: Theme = current === 'dark' ? 'light' : 'dark';

        const commitTheme = (instantSnap: boolean) => {
          const root = document.documentElement;
          if (instantSnap) {
            root.classList.add('ink-instant-flip');
          }
          flushSync(() => setTheme(next));
          if (instantSnap) {
            void root.offsetHeight;
            requestAnimationFrame(() => root.classList.remove('ink-instant-flip'));
          }
        };

        const runFallback = () => {
          const doc = document as Document & {
            startViewTransition?: (callback: () => void) => {
              finished: Promise<void>;
              ready: Promise<void>;
            };
          };
          if (
            !doc.startViewTransition ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ) {
            commitTheme(false);
            return;
          }
          const root = document.documentElement;
          const x = origin?.x ?? window.innerWidth / 2;
          const y = origin?.y ?? 40;
          const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y),
          );
          root.style.setProperty('--theme-x', `${x}px`);
          root.style.setProperty('--theme-y', `${y}px`);
          root.style.setProperty('--theme-radius', `${radius}px`);
          root.classList.add('theme-transition');
          transitioning.current = true;
          try {
            const transition = doc.startViewTransition(() => commitTheme(true));
            void transition.ready.catch(() => undefined);
            void transition.finished
              .catch(() => undefined)
              .finally(() => {
                root.classList.remove('theme-transition');
                transitioning.current = false;
              });
          } catch {
            root.classList.remove('theme-transition');
            transitioning.current = false;
            commitTheme(false);
          }
        };

        const ink = inkRef.current;
        if (!ink) {
          runFallback();
          return;
        }

        void ink
          .toggle(origin, next, () => commitTheme(true))
          .then((handled) => {
            if (!handled) {
              runFallback();
            }
          });
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
