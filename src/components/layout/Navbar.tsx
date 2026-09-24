import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { House, Menu, Moon, Sun, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NAV_PATHS, PERSONAL_INFO } from '@/lib/constants';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { LanguageSelector } from '@/components/LanguageSelector';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation('common');

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isOpen]);

  useEffect(() => setIsOpen(false), [location.pathname]);

  const isActive = (href: string) =>
    href === '/projetos/js-boy'
      ? location.pathname.startsWith('/projetos')
      : location.pathname === href;
  const linkClass = (href: string) =>
    cn(
      'rounded-sm px-2 py-2 text-sm transition-colors hover:text-foreground',
      isActive(href)
        ? 'text-foreground font-semibold after:ml-2 after:text-accent after:content-["•"]'
        : 'text-muted-foreground',
    );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-colors',
        scrolled || isOpen
          ? 'border-border bg-background/95 backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-6 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="flex items-center gap-3 font-display text-sm font-bold tracking-tight sm:text-base"
          aria-label={t('a11y.homeLink')}
          onClick={() => setIsOpen(false)}
        >
          <span className="font-mono text-lg text-accent" aria-hidden="true">
            &gt;_
          </span>
          <span>{PERSONAL_INFO.firstName} Viana</span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label={t('a11y.mainNav')}>
          {NAV_PATHS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={cn('inline-flex items-center gap-1.5', linkClass(link.path))}
              aria-current={isActive(link.path) ? 'page' : undefined}
              aria-label={link.key === 'home' ? t('a11y.goHome') : undefined}
            >
              {link.key === 'home' && <House className="h-3.5 w-3.5" aria-hidden="true" />}
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            aria-label={isOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label={t('a11y.mobileNav')}
          className="border-t border-border bg-background px-6 pb-5 pt-3 lg:hidden"
        >
          {NAV_PATHS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn('flex min-h-11 items-center gap-2 py-3', linkClass(link.path))}
              aria-current={isActive(link.path) ? 'page' : undefined}
              aria-label={link.key === 'home' ? t('a11y.goHome') : undefined}
            >
              {link.key === 'home' && <House className="h-4 w-4" aria-hidden="true" />}
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
