import { EDUCATION } from '@/data/education';
import { EXPERIENCE } from '@/data/experience';

export function Experience() {
  const role = EXPERIENCE[0];
  const degree = EDUCATION[0];
  const technical = EDUCATION[1];

  return (
    <section id="experience" className="section-container" aria-labelledby="experience-title">
      <div className="max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          03 / Trajetória
        </p>
        <h2
          id="experience-title"
          className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          Experiência e formação
        </h2>
        <p className="mt-6 leading-7 text-muted-foreground">
          Uma trajetória em construção entre trabalho profissional, formação e projetos próprios.
        </p>
      </div>
      <ol className="relative mt-14 border-l border-border pl-7 sm:pl-12">
        <li className="relative border-b border-border pb-10">
          <span
            className="absolute -left-[2.05rem] top-1 h-3 w-3 rounded-full border-2 border-accent bg-background sm:-left-[3.35rem]"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            feat/professional-experience
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{role.role}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {role.company} · {role.location}
          </p>
          <ul className="mt-5 max-w-3xl list-disc space-y-2 pl-5 leading-7 text-muted-foreground">
            {role.description.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-xs text-muted-foreground">
            {role.technologies?.join(' · ')}
          </p>
        </li>
        <li className="relative border-b border-border py-10">
          <span
            className="absolute -left-[2.05rem] top-11 h-3 w-3 rounded-full border-2 border-accent bg-background sm:-left-[3.35rem]"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            feat/software-engineering
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{degree.field}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{degree.institution} · em andamento</p>
        </li>
        <li className="relative pt-10">
          <span
            className="absolute -left-[2.05rem] top-11 h-3 w-3 rounded-full border-2 border-accent bg-background sm:-left-[3.35rem]"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            chore/technical-foundation
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{technical.field}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {technical.institution} · {technical.startDate}–{technical.endDate}
          </p>
        </li>
      </ol>
    </section>
  );
}
