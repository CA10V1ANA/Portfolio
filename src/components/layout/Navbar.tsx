import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { NAV_LINKS, PERSONAL_INFO } from '@/lib/constants';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/navigation/CommandPalette';

const SECTION_IDS = ['hero', ...NAV_LINKS.map((link) => link.href.slice(1))];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { theme, toggleTheme } = useTheme();

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

  const linkClass = (href: string) =>
    cn(
      'rounded-sm px-2 py-2 text-sm transition-colors hover:text-foreground',
      activeId === href.slice(1) ? 'text-foreground' : 'text-muted-foreground',
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
        <a
          href="#hero"
          className="flex items-center gap-3 font-display text-sm font-bold tracking-tight sm:text-base"
          aria-label="Caio Viana — início"
          onClick={() => setIsOpen(false)}
        >
          <span className="font-mono text-lg text-accent" aria-hidden="true">
            &gt;_
          </span>
          <span>{PERSONAL_INFO.firstName} Viana</span>
        </a>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              aria-current={activeId === link.href.slice(1) ? 'location' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CommandPalette />
          <a
            href={PERSONAL_INFO.resumeUrl}
            download
            className="hidden items-center gap-1 rounded-sm font-mono text-xs font-semibold uppercase tracking-widest text-foreground hover:text-accent sm:inline-flex"
          >
            CV <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
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
          aria-label="Navegação móvel"
          className="border-t border-border bg-background px-6 pb-5 pt-3 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn('block min-h-11 py-3', linkClass(link.href))}
            >
              {link.label}
            </a>
          ))}
          <a
            href={PERSONAL_INFO.resumeUrl}
            download
            onClick={() => setIsOpen(false)}
            className="block min-h-11 py-3 text-sm"
          >
            Baixar currículo
          </a>
        </nav>
      )}
    </header>
  );
}
