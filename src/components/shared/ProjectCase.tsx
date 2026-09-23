import { useState } from 'react';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import type { Project } from '@/types';

export function ProjectCase({ project, index }: { project: Project; index: number }) {
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(project.image) && !imageError;

  return (
    <article className="grid gap-8 border-t border-border py-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
      <div className={index % 2 === 1 ? 'lg:order-2' : undefined}>
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span>
            {String(index + 1).padStart(2, '0')} / {project.category}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {project.statusLabel}
          </span>
        </div>
        <h3 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.title}
        </h3>
        <p className="mt-2 text-lg text-accent">{project.subtitle}</p>
        <p className="mt-7 max-w-xl leading-7 text-muted-foreground">{project.description}</p>
        {project.problem && (
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
            <strong className="font-semibold text-foreground">O problema. </strong>
            {project.problem}
          </p>
        )}
        {project.contribution && (
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
            <strong className="font-semibold text-foreground">Minha atuação. </strong>
            {project.contribution}
          </p>
        )}
        <ul className="mt-7 flex flex-wrap gap-2" aria-label={`Tecnologias de ${project.title}`}>
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-sm border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              {technology}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-accent"
            >
              Ver aplicação <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-accent"
            >
              Ver código <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          {project.docsUrl && (
            <a
              href={project.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-accent"
            >
              Documentação <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <div className={index % 2 === 1 ? 'lg:order-1' : undefined}>
        <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-md border border-border bg-card">
          {hasImage ? (
            <img
              src={project.image}
              alt={project.imageAlt ?? `Captura da aplicação ${project.title}`}
              loading="lazy"
              width="960"
              height="600"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 px-6 text-center text-muted-foreground">
              <ImageOff className="h-8 w-8 text-accent" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest">
                Captura de {project.title} em preparação
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
