import { createContext } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
