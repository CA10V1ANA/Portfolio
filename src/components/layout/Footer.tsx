import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_LINKS, PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

const SOCIALS = [
  { name: 'GitHub', href: SOCIAL_LINKS.github, icon: FaGithub },
  { name: 'LinkedIn', href: SOCIAL_LINKS.linkedin, icon: FaLinkedin },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="section-container flex flex-col items-center gap-6 !py-12 text-center">
        <Link to="/" className="font-display text-xl font-bold">
          <span className="text-gradient">{PERSONAL_INFO.name}</span>
        </Link>

        <div className="flex items-center gap-3">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
              aria-label={social.name}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <div className="flex w-full max-w-2xl flex-col items-stretch justify-center gap-3 sm:flex-row">
          <a
            href={CONTACT_LINKS.email.href}
            aria-label={CONTACT_LINKS.email.ariaLabel}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-3 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 break-all sm:break-normal">{CONTACT_LINKS.email.label}</span>
          </a>
          <a
            href={CONTACT_LINKS.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={CONTACT_LINKS.whatsapp.ariaLabel}
            className="inline-flex min-h-11 items-center justify-center gap-3 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{CONTACT_LINKS.whatsapp.label}</span>
          </a>
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
