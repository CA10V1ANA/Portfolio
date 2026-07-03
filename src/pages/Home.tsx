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
const Certificates = lazy(() =>
  import('@/components/sections/Certificates').then((m) => ({ default: m.Certificates })),
);
const Education = lazy(() =>
  import('@/components/sections/Education').then((m) => ({ default: m.Education })),
);
const GithubStats = lazy(() =>
  import('@/components/sections/GithubStats').then((m) => ({ default: m.GithubStats })),
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

const SECTIONS = [
  About,
  Skills,
  Experience,
  Projects,
  Certificates,
  Education,
  GithubStats,
  Contact,
];

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
