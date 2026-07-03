import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { CustomCursor } from '@/components/shared/CustomCursor';
import { ScrollProgressBar } from '@/components/shared/ScrollProgressBar';
import { BackToTop } from '@/components/shared/BackToTop';
import { Loader } from '@/components/shared/Loader';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider>
      <Loader isLoading={isLoading} />
      <ScrollProgressBar />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTop />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
