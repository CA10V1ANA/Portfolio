import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { RouteMetadata } from '@/components/layout/RouteMetadata';
import { PAGES } from '@/lib/constants';

const CHAPTER_PATHS = ['/', '/sobre', '/projetos/js-boy', '/stack', '/experiencia', '/contato'];

export function PortfolioLayout() {
  const location = useLocation();
  const chapterPath = location.pathname.startsWith('/projetos/')
    ? '/projetos/js-boy'
    : location.pathname;
  const chapterIndex = CHAPTER_PATHS.indexOf(chapterPath);
  const previous = PAGES[chapterIndex > 0 ? chapterIndex - 1 : 0];
  const next = PAGES[chapterIndex >= 0 && chapterIndex < PAGES.length - 1 ? chapterIndex + 1 : chapterIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading = document.querySelector<HTMLElement>('main h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <RouteMetadata />
      <Navbar />
      <main id="main-content" key={location.pathname} className="route-content">
        <Outlet />
        {chapterIndex >= 0 && <nav className="chapter-nav" aria-label="Navegação entre páginas">
          {chapterIndex > 0 ? <Link className="chapter-nav-link" to={previous.path}><span aria-hidden="true">←</span><span><small>Página anterior</small>{previous.label}</span></Link> : <span />}
          {chapterIndex < PAGES.length - 1 ? <Link className="chapter-nav-link chapter-nav-next" to={next.path}><span><small>Próxima página</small>{next.label}</span><span aria-hidden="true">→</span></Link> : <span />}
        </nav>}
      </main>
      <Footer />
    </>
  );
}
