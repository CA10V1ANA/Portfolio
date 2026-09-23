import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { PAGES, PERSONAL_INFO, PROJECT_PATH, SOCIAL_LINKS } from '@/lib/constants';

export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const actions = useMemo(() => [
    ...PAGES.map((page) => ({ label: page.label, href: page.path, group: 'Páginas' })),
    ...PROJECTS.filter((project) => project.featured).slice(0, 4).map((project) => ({ label: project.title, href: PROJECT_PATH(project), group: 'Projetos' })),
    { label: 'Baixar currículo', href: PERSONAL_INFO.resumeUrl, group: 'Ações' },
    { label: 'Abrir GitHub', href: SOCIAL_LINKS.github, group: 'Ações' },
    { label: 'Abrir LinkedIn', href: SOCIAL_LINKS.linkedin, group: 'Ações' },
  ], []);
  const matches = actions.filter((action) => action.label.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));

  const show = useCallback(() => {
    setQuery('');
    dialogRef.current?.showModal();
    setOpen(true);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, []);
  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpen(false);
  }, []);
  function activate(href: string) {
    close();
    if (href.startsWith('/')) {
      if (href === PERSONAL_INFO.resumeUrl) {
        const link = document.createElement('a');
        link.href = href;
        link.download = '';
        link.click();
      } else navigate(href);
    } else window.open(href, '_blank', 'noopener,noreferrer');
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialogRef.current?.open) close(); else show();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close, show]);

  return (
    <>
      <button type="button" onClick={show} aria-label="Abrir navegação rápida" aria-keyshortcuts="Control+K Meta+K" className="flex h-11 items-center gap-2 rounded-md border border-border px-3 font-mono text-xs text-muted-foreground hover:text-foreground">
        <Search className="h-4 w-4" aria-hidden="true" /><span className="hidden xl:inline">Ctrl K</span>
      </button>
      <dialog ref={dialogRef} onClose={() => setOpen(false)} aria-label="Navegação rápida" className="w-[min(92vw,36rem)] rounded-lg border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/70">
        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && matches[0]) { event.preventDefault(); activate(matches[0].href); } }} placeholder="Buscar página, projeto ou ação…" aria-label="Buscar página, projeto ou ação" className="h-16 w-full bg-transparent text-base placeholder:text-muted-foreground focus-visible:outline-accent" />
          <button type="button" onClick={close} aria-label="Fechar navegação rápida" className="font-mono text-xs text-muted-foreground">ESC</button>
        </div>
        <div className="max-h-[min(60vh,26rem)] overflow-y-auto p-3">
          {matches.length ? matches.map((action) => (
            <button type="button" key={`${action.group}-${action.label}`} onClick={() => activate(action.href)} aria-current={action.href === location.pathname || (action.href === '/projetos/js-boy' && location.pathname.startsWith('/projetos')) ? 'page' : undefined} className="flex min-h-12 w-full items-center justify-between rounded-md px-4 text-left text-sm hover:bg-primary/20 focus-visible:bg-primary/20">
              <span>{action.label}</span><span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">{action.group}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
            </button>
          )) : <p className="px-4 py-6 text-sm text-muted-foreground">Nenhum resultado para “{query}”.</p>}
        </div>
        {open && <p className="border-t border-border px-5 py-3 font-mono text-xs text-muted-foreground">Enter abre o primeiro resultado · Esc fecha</p>}
      </dialog>
    </>
  );
}
