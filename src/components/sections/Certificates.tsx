import { Award, ExternalLink } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Reveal } from '@/components/shared/Reveal';
import { Card, CardContent } from '@/components/ui/card';
import { CERTIFICATES } from '@/data/certificates';
import { formatDate } from '@/lib/utils';

export function Certificates() {
  return (
    <section id="certificates" className="section-container" aria-label="Certificados">
      <SectionTitle
        eyebrow="Certificados"
        title="Cursos & Certificações"
        description="Certificações que complementam minha formação e comprovam meu aprendizado contínuo."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.map((cert, index) => (
          <Reveal key={cert.id} delay={index * 0.08}>
            <Card className="group h-full transition-all duration-300 hover:-translate-y-2 hover:border-primary/40">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Award className="h-6 w-6" />
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Ver credencial de ${cert.title}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-tight">{cert.title}</h3>
                  <p className="mt-1 text-sm font-medium text-primary">{cert.issuer}</p>
                </div>
                <p className="mt-auto text-xs uppercase tracking-widest text-muted-foreground">
                  {formatDate(cert.date)}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
