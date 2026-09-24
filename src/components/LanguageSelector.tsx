import { useCallback, useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/locale';
import { cn } from '@/lib/utils';

export function LanguageSelector() {
  const { i18n, t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLocale = SUPPORTED_LOCALES.find((l) => l.code === i18n.language) ?? SUPPORTED_LOCALES[0];

  const changeLanguage = useCallback(
    (locale: SupportedLocale) => {
      i18n.changeLanguage(locale);
      setOpen(false);
      buttonRef.current?.focus();
    },
    [i18n],
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  // Keyboard navigation
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (!open) {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setOpen(true);
          return;
        }
        return;
      }
      const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
      if (!items) return;
      const focusedIndex = Array.from(items).findIndex((item) => item === document.activeElement);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = (focusedIndex + 1) % items.length;
        items[next].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = (focusedIndex - 1 + items.length) % items.length;
        items[prev].focus();
      }
    },
    [open],
  );

  // Focus first item when menu opens
  useEffect(() => {
    if (open) {
      const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
      const currentIndex = SUPPORTED_LOCALES.findIndex((l) => l.code === i18n.language);
      items?.[currentIndex >= 0 ? currentIndex : 0]?.focus();
    }
  }, [open, i18n.language]);

  return (
    <div ref={containerRef} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('language.label')}
        className="flex h-11 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="font-medium">{currentLocale.shortCode}</span>
        <ChevronDown
          className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={t('language.label')}
          className="absolute right-0 top-full z-50 mt-2 min-w-[12rem] overflow-hidden rounded-lg border border-border bg-card shadow-xl"
        >
          {SUPPORTED_LOCALES.map((locale) => {
            const isSelected = locale.code === i18n.language;
            return (
              <button
                key={locale.code}
                type="button"
                role="menuitem"
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => changeLanguage(locale.code)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:outline-none',
                  isSelected && 'text-accent font-medium',
                )}
              >
                <span className="w-6 font-mono text-xs font-semibold">{locale.shortCode}</span>
                <span className="flex-1">{locale.nativeLabel}</span>
                {isSelected && <Check className="h-4 w-4 text-accent" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
