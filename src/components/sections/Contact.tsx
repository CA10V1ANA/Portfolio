import { Loader2, Mail, MapPin, Send } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Reveal } from '@/components/shared/Reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContactForm } from '@/hooks/useContactForm';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

const CONTACT_INFO = [
  { icon: Mail, label: 'E-mail', value: PERSONAL_INFO.email, href: SOCIAL_LINKS.email },
  { icon: FaGithub, label: 'GitHub', value: 'CA10V1ANA', href: SOCIAL_LINKS.github },
  { icon: FaLinkedin, label: 'LinkedIn', value: 'Caio Viana', href: SOCIAL_LINKS.linkedin },
  { icon: MapPin, label: 'Localização', value: PERSONAL_INFO.location, href: undefined },
];

export function Contact() {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useContactForm();

  return (
    <section id="contact" className="section-container" aria-label="Contato">
      <SectionTitle
        eyebrow="Contato"
        title="Vamos Conversar?"
        description="Estou disponível para novas oportunidades e projetos. Envie uma mensagem ou me encontre nas redes abaixo."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <Reveal direction="right" className="lg:col-span-2">
          <div className="flex h-full flex-col gap-4">
            {CONTACT_INFO.map((info) => {
              const content = (
                <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary/40">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {info.label}
                      </p>
                      <p className="font-medium">{info.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );

              return info.href ? (
                <a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {content}
                </a>
              ) : (
                <div key={info.label}>{content}</div>
              );
            })}
          </div>
        </Reveal>

        <Reveal direction="left" className="lg:col-span-3">
          <Card className="border-white/10">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Conte um pouco sobre o projeto ou oportunidade..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
