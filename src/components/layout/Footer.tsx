import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

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
