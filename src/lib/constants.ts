import type { Project } from '@/types';

export const PERSONAL_INFO = {
  name: 'Caio de Oliveira Viana',
  firstName: 'Caio',
  resumeUrl: '/Caio-Viana-Curriculo.pdf',
};

export const SOCIAL_LINKS = {
  github: 'https://github.com/CA10V1ANA',
  linkedin: 'https://www.linkedin.com/in/caio-viana-898811312',
};

export const CONTACT_LINKS = {
  email: {
    label: 'caiodeoliveira076@gmail.com',
    href: 'mailto:caiodeoliveira076@gmail.com',
  },
  whatsapp: {
    label: '+55 (85) 98111-2664',
    href: 'https://wa.me/5585981112664',
  },
} as const;

export const GITHUB_USERNAME = 'CA10V1ANA';

/**
 * Navigation link paths. Labels come from i18n `common:nav.*` keys.
 */
export const NAV_PATHS = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/sobre' },
  { key: 'projects', path: '/projetos/js-boy' },
  { key: 'stack', path: '/stack' },
  { key: 'experience', path: '/experiencia' },
  { key: 'contact', path: '/contato' },
] as const;

/**
 * SEO metadata keys per route. Used by RouteMetadata to look up translated
 * title/description from the `pages` namespace.
 */
export const ROUTE_SEO_MAP: Record<string, { titleKey: string; descKey: string }> = {
  '/': { titleKey: 'home.seo.title', descKey: 'home.seo.description' },
  '/sobre': { titleKey: 'about.seo.title', descKey: 'about.seo.description' },
  '/stack': { titleKey: 'stack:seo.title', descKey: 'stack:seo.description' },
  '/experiencia': { titleKey: 'experience.seo.title', descKey: 'experience.seo.description' },
  '/contato': { titleKey: 'contact.seo.title', descKey: 'contact.seo.description' },
};

export const PROJECT_PATH = (project: Pick<Project, 'id'>) => `/projetos/${project.id}`;
