import type { Project } from '@/types';

export const PERSONAL_INFO = {
  name: 'Caio de Oliveira Viana',
  firstName: 'Caio',
  title: 'Full Stack Developer',
  subtitle: 'Software Engineering Student',
  location: 'Fortaleza, Ceará, Brasil',
  resumeUrl: '/Caio-Viana-Curriculo.pdf',
};

export const SOCIAL_LINKS = {
  github: 'https://github.com/CA10V1ANA',
  linkedin: 'https://www.linkedin.com/in/caio-viana-898811312',
};

export const GITHUB_USERNAME = 'CA10V1ANA';

export const PAGES = [
  { label: 'Início', path: '/', title: 'Caio Viana — Desenvolvedor Full Stack', description: 'Portfólio de Caio Viana, desenvolvedor Full Stack em Fortaleza, CE.' },
  { label: 'Sobre', path: '/sobre', title: 'Sobre — Caio Viana', description: 'Conheça a atuação, formação e abordagem de Caio Viana em desenvolvimento de software.' },
  { label: 'Projetos', path: '/projetos/js-boy', title: 'Projetos — Caio Viana', description: 'Projetos de software desenvolvidos por Caio Viana.' },
  { label: 'Stack', path: '/stack', title: 'Stack — Caio Viana', description: 'Tecnologias de frontend, backend, dados e ferramentas usadas por Caio Viana.' },
  { label: 'Experiência', path: '/experiencia', title: 'Experiência — Caio Viana', description: 'Experiência profissional e formação em Engenharia de Software de Caio Viana.' },
  { label: 'Contato', path: '/contato', title: 'Contato — Caio Viana', description: 'Entre em contato com Caio Viana para conversar sobre desenvolvimento de software.' },
] as const;

export const NAV_LINKS = PAGES.slice(1).map(({ label, path }) => ({ label, href: path }));

export const PROJECT_PATH = (project: Pick<Project, 'id'>) => `/projetos/${project.id}`;
