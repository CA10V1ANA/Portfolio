import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
