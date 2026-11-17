import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PROJECTS, PROJECT_I18N_MAP } from '@/data/projects';
import { PROJECT_PATH } from '@/lib/constants';
import { ProjectCoverLink } from '@/components/shared/ProjectCoverLink';

const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured).slice(0, 4);

export function Projects() {
  const { t } = useTranslation('pages');
  const { t: tp } = useTranslation('projects');
  const { t: tc } = useTranslation('common');
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('[data-project-reveal]');
    if (!cards) return;
    const reveal = (card: HTMLElement) => {
      card.dataset.projectReveal = 'visible';
    };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    );
    const onPreferenceChange = () => {
      if (motion.matches) {
        cards.forEach(reveal);
        observer.disconnect();
      }
    };
    cards.forEach((card) => (motion.matches ? reveal(card) : observer.observe(card)));
    motion.addEventListener('change', onPreferenceChange);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', onPreferenceChange);
    };
  }, []);

  return (
    <section
      id="projects"
      className="section-container projects-section"
      aria-labelledby="projects-title"
    >
      <div className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <div>
          <p className="eyebrow">{t('projectsSection.eyebrow')}</p>
          <h2 id="projects-title" className="page-title">
            {t('projectsSection.title')}
          </h2>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground lg:justify-self-end">
          {t('projectsSection.description')}
        </p>
      </div>

      <div className="project-grid" ref={gridRef}>
        {FEATURED_PROJECTS.map((project, index) => {
          const key = PROJECT_I18N_MAP[project.id] ?? project.id;

          return (
            <article
              className={`project-card ${index === 0 ? 'project-featured' : ''}`}
              key={project.id}
              data-project-reveal="pending"
              onFocusCapture={(event) => {
                event.currentTarget.dataset.projectReveal = 'visible';
              }}
            >
              <ProjectCoverLink
                project={project}
                label={`${tc('actions.viewCase')}: ${project.title}`}
              />
              <div className="project-card-copy">
                <div className="project-card-topline">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, '0')} /{' '}
                    {String(FEATURED_PROJECTS.length).padStart(2, '0')}
                  </span>
                  <span className="status-chip">
                    <span aria-hidden="true" />
                    {tp(`${key}.statusLabel`)}
                  </span>
                </div>

                <p className="eyebrow mt-6">{tp(`${key}.category`)}</p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                  {tp(`${key}.description`)}
                </p>

                <ul
                  className="mt-5 flex flex-wrap gap-2"
                  aria-label={tc('a11y.techOf', { name: project.title })}
                >
                  {project.technologies.slice(0, 3).map((technology) => (
                    <li className="tech-chip" key={technology}>
                      {technology}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-9">
                  <Link className="text-link" to={PROJECT_PATH(project)}>
                    {tc('actions.viewCase')} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                  {project.githubUrl && (
                    <a
                      className="text-link text-muted-foreground"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {tc('actions.viewCode')} <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
