import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { TECHNOLOGIES } from '@/data/technologies';

export function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualUntil, setManualUntil] = useState(0);
  const reducedMotion = useReducedMotion();
  const active = TECHNOLOGIES[activeIndex];

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      if (Date.now() >= manualUntil) setActiveIndex((index) => (index + 1) % TECHNOLOGIES.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [manualUntil, reducedMotion]);

  function select(index: number) {
    setActiveIndex(index);
    setManualUntil(Date.now() + 12000);
  }

  return (
    <section
      id="skills"
      className="border-y border-border bg-card/50"
      aria-labelledby="stack-title"
    >
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            02 / Ecossistema técnico
          </p>
          <h2
            id="stack-title"
            className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Tecnologias em contexto
          </h2>
          <p className="mt-6 leading-7 text-muted-foreground">
            Ferramentas que aparecem no meu trabalho e nos projetos. Selecione uma tecnologia para
            ver onde ela se encaixa.
          </p>
        </div>

        <div className="relative mt-14 overflow-hidden rounded-lg border border-border bg-background px-5 pb-12 pt-10 sm:px-10 sm:pt-14">
          <div
            className="pointer-events-none absolute left-1/2 top-36 hidden h-52 w-px -translate-x-1/2 bg-gradient-to-b from-border to-transparent lg:block"
            aria-hidden="true"
          />
          <div
            className="relative z-10 flex flex-wrap justify-center gap-3 sm:gap-4"
            role="group"
            aria-label="Selecionar tecnologia"
          >
            {TECHNOLOGIES.map((technology, index) => (
              <button
                key={technology.name}
                type="button"
                onClick={() => select(index)}
                aria-pressed={index === activeIndex}
                className={`flex min-h-12 items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-colors sm:text-sm ${index === activeIndex ? 'border-accent bg-primary/20 text-foreground' : 'border-border text-muted-foreground hover:border-accent hover:text-foreground'}`}
              >
                <technology.icon className="h-5 w-5" aria-hidden="true" />
                {technology.name}
              </button>
            ))}
          </div>

          <div className="relative z-10 mx-auto mt-14 flex max-w-md flex-col items-center text-center sm:mt-20">
            <div className="flex h-48 w-48 items-center justify-center rounded-full border border-accent/40 bg-primary/10 shadow-[0_0_70px_rgba(113,39,186,0.12)] sm:h-56 sm:w-56">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.name}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -28, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.9 }}
                  transition={{ duration: reducedMotion ? 0.12 : 0.35 }}
                  className="flex flex-col items-center gap-4"
                >
                  <active.icon className="h-14 w-14 text-accent" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {active.category}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            <div aria-live="polite" aria-atomic="true">
              <h3 className="mt-8 text-2xl font-semibold">{active.name}</h3>
              <p className="mt-2 text-muted-foreground">{active.context}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
