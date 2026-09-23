import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[90svh] items-center border-b border-border px-6 pb-20 pt-32 sm:px-8 lg:px-10"
    >
      <div
        className="pointer-events-none absolute right-0 top-0 -z-10 h-[36rem] w-[36rem] max-w-full rounded-full bg-primary/10 blur-[110px]"
        aria-hidden="true"
      />
      <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:items-end">
        <div>
          <p className="mb-7 font-mono text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Full Stack Developer · Fortaleza, CE
          </p>
          <h1 className="max-w-4xl font-display text-[clamp(4rem,10vw,8.75rem)] font-semibold leading-[0.96] tracking-[-0.075em]">
            Caio <span className="text-accent">Viana.</span>
          </h1>
          <p className="mt-10 max-w-[42rem] text-xl leading-relaxed text-muted-foreground sm:text-2xl">
            Desenvolvo aplicações completas, do backend à interface, transformando problemas reais
            em produtos de software.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/sobre"
              className="inline-flex min-h-12 items-center gap-3 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-secondary"
            >
              Conhecer meu trabalho <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/projetos/js-boy"
              className="inline-flex min-h-12 items-center gap-3 rounded-md border border-border px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              Projeto em destaque <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-3 rounded-md border border-border px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              GitHub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
          <p className="mb-5 hidden font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground sm:block">
            developer.ts
          </p>
          <pre className="hidden overflow-x-auto font-mono text-xs leading-7 text-muted-foreground sm:block sm:text-sm">
            <code>{`const developer = {
  name: "Caio Viana",
  role: "Full Stack Developer",
  focus: ["Web", "Backend",
          "Software Engineering"]
};`}</code>
          </pre>
          <dl className="mt-8 grid gap-3 border-t border-border pt-6 font-mono text-xs sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex gap-4">
              <dt className="text-muted-foreground">location</dt>
              <dd>Fortaleza — CE</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-muted-foreground">education</dt>
              <dd>Engenharia de Software</dd>
            </div>
          </dl>
          <a
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href={PERSONAL_INFO.resumeUrl}
            download
          >
            Baixar currículo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
