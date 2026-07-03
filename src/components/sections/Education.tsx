import { GraduationCap } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Reveal } from '@/components/shared/Reveal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EDUCATION } from '@/data/education';
import { formatDate } from '@/lib/utils';

export function Education() {
  return (
    <section id="education" className="section-container" aria-label="Formação acadêmica">
      <SectionTitle
        eyebrow="Formação"
        title="Formação Acadêmica"
        description="Base acadêmica que sustenta minha atuação como desenvolvedor full stack."
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {EDUCATION.map((edu, index) => (
          <Reveal key={edu.id} delay={index * 0.1}>
            <Card className="overflow-hidden border-white/10 transition-all hover:border-secondary/40">
              <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 text-secondary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      {edu.degree} em {edu.field}
                    </h3>
                    <p className="font-medium text-secondary">{edu.institution}</p>
                    {edu.description && (
                      <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">
                  {formatDate(edu.startDate)} — {edu.current ? 'Atual' : formatDate(edu.endDate!)}
                </Badge>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
