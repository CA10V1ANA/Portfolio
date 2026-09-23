import { lazy, Suspense } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const About = lazy(() => import('@/components/sections/About').then((m) => ({ default: m.About })));
const Skills = lazy(() =>
  import('@/components/sections/Skills').then((m) => ({ default: m.Skills })),
);
const Experience = lazy(() =>
  import('@/components/sections/Experience').then((m) => ({ default: m.Experience })),
);
const Projects = lazy(() =>
  import('@/components/sections/Projects').then((m) => ({ default: m.Projects })),
);
const Contact = lazy(() =>
  import('@/components/sections/Contact').then((m) => ({ default: m.Contact })),
);

function SectionFallback() {
  return (
    <div className="section-container flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  );
}

const SECTIONS = [Projects, Skills, Experience, About, Contact];

export function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {SECTIONS.map((Section, index) => (
          <ErrorBoundary key={index}>
            <Suspense fallback={<SectionFallback />}>
              <Section />
            </Suspense>
          </ErrorBoundary>
        ))}
      </main>
      <Footer />
    </>
  );
}
