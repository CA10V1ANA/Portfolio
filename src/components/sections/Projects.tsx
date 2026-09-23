import { ArrowUpRight } from 'lucide-react';
import { ProjectCase } from '@/components/shared/ProjectCase';
import { PROJECTS } from '@/data/projects';

const featured = PROJECTS.filter((project) => project.featured);
const other = PROJECTS.filter((project) => !project.featured);

export function Projects() {
  return (
    <section id="projects" className="section-container" aria-labelledby="projects-title">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            01 / Trabalhos selecionados
          </p>
          <h2
            id="projects-title"
            className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Projetos em destaque
          </h2>
        </div>
        <p className="max-w-sm leading-7 text-muted-foreground">
          Produtos e estudos com contextos diferentes, apresentados pelo problema que cada um ajuda
          a resolver.
        </p>
      </div>
      {featured.map((project, index) => (
        <ProjectCase key={project.id} project={project} index={index} />
      ))}

      <div className="mt-12 border-t border-border pt-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">Outros projetos</h3>
          <span className="font-mono text-xs text-muted-foreground">Explorações e estudos</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {other.map((project) => (
            <article key={project.id} className="flex flex-col border border-border p-6">
              <span className="font-mono text-[0.7rem] uppercase tracking-widest text-accent">
                {project.category}
              </span>
              <h4 className="mt-5 text-xl font-semibold">{project.title}</h4>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {project.description}
              </p>
              <p className="mt-5 font-mono text-xs text-muted-foreground">
                {project.technologies.join(' · ')}
              </p>
              <div className="mt-5 flex gap-5 text-sm">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    Abrir <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-accent"
                  >
                    Código <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
