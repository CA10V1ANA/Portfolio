import { lazy, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
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

export function HomePage() {
  const reducedMotion = useReducedMotion();
  const { hash } = useLocation();

  useEffect(() => {
    const sectionId = hash.replace('#', '');
    if (!sectionId) return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, reducedMotion]);

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
    <div className="scroll-portfolio">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </div>
  );
}
