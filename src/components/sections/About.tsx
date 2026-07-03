import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Reveal } from '@/components/shared/Reveal';
import { DynamicIcon } from '@/components/shared/DynamicIcon';
import { Card, CardContent } from '@/components/ui/card';
import { ABOUT_HIGHLIGHTS, ABOUT_TIMELINE } from '@/data/about';

export function About() {
  return (
    <section id="about" className="section-container" aria-label="Sobre mim">
      <SectionTitle
        eyebrow="Sobre mim"
        title="Quem é Caio de Oliveira Viana"
        description="Full Stack Developer e estudante de Engenharia de Software, apaixonado por transformar ideias em produtos digitais robustos e bem projetados."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT_HIGHLIGHTS.map((highlight, index) => (
          <Reveal key={highlight.title} delay={index * 0.1}>
            <Card className="group h-full transition-all duration-300 hover:-translate-y-2 hover:border-primary/40">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-transform duration-300 group-hover:scale-110">
                  <DynamicIcon name={highlight.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-24">
        <Reveal>
          <h3 className="mb-12 text-center font-display text-2xl font-bold sm:text-3xl">
            Minha Trajetória
          </h3>
        </Reveal>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-[7px] top-1 h-full w-px bg-gradient-to-b from-primary via-accent to-secondary" />

          <div className="flex flex-col gap-12">
            {ABOUT_TIMELINE.map((entry, index) => (
              <Reveal
                key={entry.id}
                direction="right"
                delay={index * 0.05}
                className="relative pl-10"
              >
                <motion.span
                  className="absolute left-0 top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-background bg-primary"
                  whileInView={{ scale: [0.5, 1.3, 1] }}
                  transition={{ duration: 0.5 }}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {entry.date}
                </span>
                <h4 className="mt-1 font-display text-lg font-semibold">{entry.title}</h4>
                <p className="text-sm font-medium text-secondary">{entry.subtitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{entry.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
