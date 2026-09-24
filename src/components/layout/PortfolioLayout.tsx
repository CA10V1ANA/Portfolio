import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { RouteMetadata } from '@/components/layout/RouteMetadata';

export function PortfolioLayout() {
  const location = useLocation();
  const { t } = useTranslation('common');

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
      <a className="skip-link" href="#main-content">
        {t('a11y.skipToContent')}
      </a>
      <RouteMetadata />
      <Navbar />
      <main id="main-content" key={location.pathname} className="route-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
