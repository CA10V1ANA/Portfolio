import { Briefcase, MapPin } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Reveal } from '@/components/shared/Reveal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EXPERIENCE } from '@/data/experience';
import { formatDate } from '@/lib/utils';

export function Experience() {
  return (
    <section id="experience" className="section-container" aria-label="Experiência profissional">
      <SectionTitle
        eyebrow="Experiência"
        title="Trajetória Profissional"
        description="Minha atuação no mercado de trabalho como desenvolvedor full stack."
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {EXPERIENCE.map((exp, index) => (
          <Reveal key={exp.id} delay={index * 0.1}>
            <Card className="overflow-hidden border-white/10 transition-all hover:border-primary/40">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{exp.role}</h3>
                      <p className="font-medium text-primary">{exp.company}</p>
                      {exp.location && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {exp.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {formatDate(exp.startDate)} — {exp.current ? 'Atual' : formatDate(exp.endDate!)}
                  </Badge>
                </div>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {exp.description.map((line) => (
                    <li key={line} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {line}
                    </li>
                  ))}
                </ul>

                {exp.technologies && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
