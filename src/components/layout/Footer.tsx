import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_LINKS, PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

const FOOTER_LINKS = [
  { name: 'GitHub', href: SOCIAL_LINKS.github, icon: FaGithub },
  { name: 'LinkedIn', href: SOCIAL_LINKS.linkedin, icon: FaLinkedin },
  { name: `E-mail: ${CONTACT_LINKS.email.label}`, href: CONTACT_LINKS.email.href, icon: Mail },
  {
    name: `WhatsApp: ${CONTACT_LINKS.whatsapp.label}`,
    href: CONTACT_LINKS.whatsapp.href,
    icon: FaWhatsapp,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="section-container flex flex-col items-center gap-6 !py-12 text-center">
        <Link to="/" className="font-display text-xl font-bold">
          <span className="text-gradient">{PERSONAL_INFO.name}</span>
        </Link>

        <div className="flex items-center gap-3" role="group" aria-label="Redes sociais e contato">
          {FOOTER_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={social.name}
              title={social.name}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <social.icon className="h-5 w-5" aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          &copy; {year} {PERSONAL_INFO.name}. Todos os direitos reservados.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Desenvolvido com React, TypeScript e Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
