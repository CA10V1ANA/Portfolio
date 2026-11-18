import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { RouteMetadata } from '@/components/layout/RouteMetadata';
import { KineticGrid } from '@/components/ui/kinetic-grid';

export function PortfolioLayout() {
  const location = useLocation();
  const { t } = useTranslation('common');
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const changedRoute = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    const sectionId = location.hash.replace('#', '');

    if (location.pathname === '/' && sectionId) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scroll = () => {
        const target = document.getElementById(sectionId);
        if (!target) return;
        // Layout offsets exclude reveal transforms, keeping the heading below the header.
        let top = 0;
        let node: HTMLElement | null = target;
        while (node) {
          top += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        const offset =
          parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
        window.scrollTo({
          top: Math.max(0, top - offset),
          behavior: reducedMotion ? 'instant' : 'smooth',
        });
      };
      // Route chunks can mount after this effect; observe until the target exists.
      if (document.getElementById(sectionId)) {
        scroll();
        return;
      }
      const observer = new MutationObserver(() => {
        if (document.getElementById(sectionId)) {
          scroll();
          observer.disconnect();
        }
      });
      observer.observe(document.getElementById('main-content')!, {
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading = changedRoute ? document.querySelector<HTMLElement>('main h1') : null;
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [location.hash, location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('a11y.skipToContent')}
      </a>
      <KineticGrid />
      <RouteMetadata />
      <Navbar />
      <main id="main-content" key={location.pathname} className="route-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
