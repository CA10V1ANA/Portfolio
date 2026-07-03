import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { NAV_LINKS, PERSONAL_INFO } from '@/lib/constants';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace('#', ''));

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { theme, toggleTheme } = useTheme();

  function handleNavigate(href: string) {
    setIsOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="section-container flex h-20 items-center justify-between !py-0">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('#hero');
          }}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 font-display text-lg font-bold"
          aria-label="Início"
        >
          <span className="text-gradient">CV</span>
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            {PERSONAL_INFO.firstName} Viana
          </span>
        </a>

        <nav
          className="glass hidden items-center gap-1 rounded-full px-2 py-2 lg:flex"
          aria-label="Navegação principal"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavigate(link.href)}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeId === link.href.replace('#', '')
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {activeId === link.href.replace('#', '') && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="glass !rounded-full"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="glass !rounded-full lg:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass mx-6 mt-2 overflow-hidden rounded-2xl lg:hidden"
            aria-label="Navegação móvel"
          >
            <div className="flex flex-col p-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className={cn(
                    'rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                    activeId === link.href.replace('#', '')
                      ? 'bg-white/10 text-foreground'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
