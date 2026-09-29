import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PROJECTS, PROJECT_I18N_MAP } from '@/data/projects';
import { PROJECT_PATH } from '@/lib/constants';

const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured).slice(0, 4);

export function Projects() {
  const { t } = useTranslation('pages');
  const { t: tp } = useTranslation('projects');
  const { t: tc } = useTranslation('common');

  return (
    <section
      id="projects"
      className="section-container page-section"
      aria-labelledby="projects-title"
      data-scroll-section
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

      <div className="project-grid">
        {FEATURED_PROJECTS.map((project, index) => {
          const key = PROJECT_I18N_MAP[project.id] ?? project.id;

          return (
            <article className="project-card" key={project.id}>
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

              <p className="eyebrow mt-10">{tp(`${key}.category`)}</p>
              <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {project.title}
              </h3>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                {tp(`${key}.description`)}
              </p>

              <ul
                className="mt-7 flex flex-wrap gap-2"
                aria-label={tc('a11y.techOf', { name: project.title })}
              >
                {project.technologies.slice(0, 5).map((technology) => (
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
