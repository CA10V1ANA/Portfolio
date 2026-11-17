import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { ThemeContext, type Theme } from './theme-context';

const STORAGE_KEY = 'dev-viana-theme';
const THEME_COLORS: Record<Theme, string> = {
  light: '#f4efe7',
  dark: '#151b1e',
};

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* System preference is available even when storage is blocked. */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const explicitChoice = useRef(false);
  const transitioning = useRef(false);

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
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      explicitChoice.current = stored === 'dark' || stored === 'light';
    } catch {
      /* Keep following the system if storage is unavailable. */
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      if (!explicitChoice.current) setTheme(media.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: (origin?: { x: number; y: number }) => {
        if (transitioning.current) return;
        const next = theme === 'dark' ? 'light' : 'dark';
        const update = () => {
          explicitChoice.current = true;
          try {
            window.localStorage.setItem(STORAGE_KEY, next);
          } catch {
            /* Switching still works. */
          }
          flushSync(() => setTheme(next));
        };
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
          update();
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
          const transition = doc.startViewTransition(update);
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
          update();
        }
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
