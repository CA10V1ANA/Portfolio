import { lazy, Suspense, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Hero } from '@/components/sections/Hero';

const About = lazy(() =>
  import('@/components/sections/About').then((module) => ({ default: module.About })),
);
const Projects = lazy(() =>
  import('@/components/sections/Projects').then((module) => ({ default: module.Projects })),
);
const Skills = lazy(() =>
  import('@/components/sections/Skills').then((module) => ({ default: module.Skills })),
);
const Experience = lazy(() =>
  import('@/components/sections/Experience').then((module) => ({ default: module.Experience })),
);
const Contact = lazy(() =>
  import('@/components/sections/Contact').then((module) => ({ default: module.Contact })),
);

function PortfolioSections() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-section]'));

    if (reducedMotion) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <>
      <Projects />
      <About />
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}

export function HomePage() {
  const { t } = useTranslation('common');
  return (
    <div className="scroll-portfolio">
      <Hero />
      <Suspense
        fallback={
          <div className="section-container min-h-96 text-muted-foreground" role="status">
            {t('status.loading')}
          </div>
        }
      >
        <PortfolioSections />
      </Suspense>
    </div>
  );
}
