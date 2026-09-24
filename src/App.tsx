import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@/context/ThemeProvider';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { Hero } from '@/components/sections/Hero';
import { NotFound } from '@/pages/NotFound';
import { ProjectPage } from '@/pages/ProjectPage';

const About = lazy(() => import('@/components/sections/About').then((m) => ({ default: m.About })));
const Skills = lazy(() => import('@/components/sections/Skills').then((m) => ({ default: m.Skills })));
const Experience = lazy(() => import('@/components/sections/Experience').then((m) => ({ default: m.Experience })));
const Contact = lazy(() => import('@/components/sections/Contact').then((m) => ({ default: m.Contact })));

function PageFallback() {
  const { t } = useTranslation('common');
  return <div className="section-container page-section" role="status">{t('status.loading')}</div>;
}

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PortfolioLayout />}>
            <Route path="/" element={<Hero />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/projetos" element={<Navigate to="/projetos/js-boy" replace />} />
            <Route path="/projetos/:slug" element={<ProjectPage />} />
            <Route path="/stack" element={<Skills />} />
            <Route path="/experiencia" element={<Experience />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
