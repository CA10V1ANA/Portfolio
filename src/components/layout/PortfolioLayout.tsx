import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { RouteMetadata } from '@/components/layout/RouteMetadata';
import { GitEcosystemBackground } from '@/components/shared/GitEcosystemBackground';

export function PortfolioLayout() {
  const location = useLocation();
  const { t } = useTranslation('common');

  useEffect(() => {
    const sectionId = location.hash.replace('#', '');

    if (location.pathname === '/' && sectionId) {
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading = document.querySelector<HTMLElement>('main h1');
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
      <RouteMetadata />
      <GitEcosystemBackground />
      <Navbar />
      <main id="main-content" key={location.pathname} className="route-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
