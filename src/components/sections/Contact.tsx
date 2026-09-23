import { ArrowUpRight } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

export function Contact() {
  return (
    <section
      id="contact"
      className="section-container border-t border-border"
      aria-labelledby="contact-title"
    >
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">05 / Contato</p>
      <h2
        id="contact-title"
        className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl"
      >
        Vamos construir algo útil.
      </h2>
      <p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">
        Tem uma oportunidade, projeto ou quer conversar sobre desenvolvimento? Vamos nos conectar.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-secondary"
        >
          LinkedIn <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold hover:border-accent hover:text-accent"
        >
          GitHub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
