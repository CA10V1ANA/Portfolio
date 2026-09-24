import { useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PROJECTS, PROJECT_I18N_MAP } from '@/data/projects';
import { PROJECT_PATH, SOCIAL_LINKS } from '@/lib/constants';

const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured).slice(0, 4);

export function ProjectPage() {
  const { slug } = useParams();
  const projects = FEATURED_PROJECTS;
  const navigate = useNavigate();
  const index = projects.findIndex((project) => project.id === slug);
  const project = projects[index];
  const { t: tc } = useTranslation('common');
  const { t: tp } = useTranslation('projects');

  useEffect(() => {
    if (index < 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
        return;
      if (event.key === 'ArrowLeft')
        navigate(PROJECT_PATH(projects[(index - 1 + projects.length) % projects.length]));
      if (event.key === 'ArrowRight')
        navigate(PROJECT_PATH(projects[(index + 1) % projects.length]));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, navigate, projects]);

  if (!project) {
    return (
      <section className="section-container page-section" aria-labelledby="missing-project-title">
        <p className="eyebrow">{tc('projects.label')}</p>
        <h1 id="missing-project-title" className="page-title">
          {tc('error.projectNotFound')}
        </h1>
        <Link className="text-link mt-8 inline-flex" to="/projetos/js-boy">
          {tc('actions.openJsBoy')}
        </Link>
      </section>
    );
  }

  const i18nKey = PROJECT_I18N_MAP[project.id] ?? project.id;
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <section className="section-container page-section" aria-labelledby="project-title">
      <div className="project-toolbar">
        <div className="flex items-center gap-4">
          <p className="eyebrow">
            {tc('projects.label')} / {tc('projects.counter', { current: String(index + 1).padStart(2, '0'), total: String(projects.length).padStart(2, '0') })}
          </p>
          <nav className="project-pager" aria-label={tc('a11y.projectNav')}>
            <Link
              to={PROJECT_PATH(previous)}
              aria-label={tc('actions.previousProject')}
              title={previous.title}
            >
              <ChevronLeft aria-hidden="true" />
            </Link>
            <Link
              to={PROJECT_PATH(next)}
              aria-label={tc('actions.nextProject')}
              title={next.title}
            >
              <ChevronRight aria-hidden="true" />
            </Link>
          </nav>
        </div>
        <span className="status-chip">
          <span aria-hidden="true" />
          {tp(`${i18nKey}.statusLabel`)}
        </span>
      </div>
      <div
        className={
          project.screenshots?.[0]
            ? 'grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.55fr)] lg:gap-20'
            : 'max-w-4xl'
        }
      >
        <div>
          <p className="eyebrow">{tp(`${i18nKey}.context`, { defaultValue: tp(`${i18nKey}.category`) })}</p>
          <h1 id="project-title" className="page-title">
            {project.title}
          </h1>
          <p className="mt-3 text-xl text-accent">{tp(`${i18nKey}.subtitle`)}</p>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            {tp(`${i18nKey}.description`)}
          </p>
          {tp(`${i18nKey}.problem`, { defaultValue: '' }) && (
            <p className="mt-7 max-w-2xl leading-7 text-muted-foreground">
              <strong className="text-foreground">{tc('projects.problem')} </strong>
              {tp(`${i18nKey}.problem`)}
            </p>
          )}
          {tp(`${i18nKey}.contribution`, { defaultValue: '' }) && (
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
              <strong className="text-foreground">{tc('projects.contribution')} </strong>
              {tp(`${i18nKey}.contribution`)}
            </p>
          )}
          <h2 className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {tc('projects.technologies')}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={tc('a11y.techOf', { name: project.title })}>
            {project.technologies.map((technology) => (
              <li className="tech-chip" key={technology}>
                {technology}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4">
            {project.demoUrl && (
              <a className="text-link" href={project.demoUrl} target="_blank" rel="noreferrer">
                {tc('actions.viewProject')} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
            {project.githubUrl && (
              <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
                {tc('actions.viewCode')} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
            {project.docsUrl && (
              <a className="text-link" href={project.docsUrl} target="_blank" rel="noreferrer">
                {tc('actions.viewDocs')} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
            {project.id === 'devpilot' && (
              <a className="text-link" href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
                {tc('actions.exploreGithub')} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
        {project.screenshots?.[0] && (
          <figure className="project-visual">
            <img src={project.screenshots[0].src} alt={project.screenshots[0].alt} loading="lazy" />
          </figure>
        )}
      </div>
    </section>
  );
}
