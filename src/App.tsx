import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '@/context/ThemeProvider';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { NotFound } from '@/pages/NotFound';
import { HomePage } from '@/pages/HomePage';
import { ProjectPage } from '@/pages/ProjectPage';

function PageFallback() {
  const { t } = useTranslation('common');
  return (
    <div className="section-container page-section" role="status">
      {t('status.loading')}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PortfolioLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<Navigate to="/#about" replace />} />
            <Route path="/projetos" element={<Navigate to="/#projects" replace />} />
            <Route path="/projetos/:slug" element={<ProjectPage />} />
            <Route path="/stack" element={<Navigate to="/#skills" replace />} />
            <Route path="/experiencia" element={<Navigate to="/#experience" replace />} />
            <Route path="/contato" element={<Navigate to="/#contact" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
