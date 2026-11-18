import type { Project } from '@/types';

/**
 * Translation key mapping for each project.
 * Keys reference the `projects` namespace in i18n files.
 */
export const PROJECT_I18N_MAP: Record<string, string> = {
  'js-boy': 'jsBoy',
  'sonho-de-pudim': 'sonhoDePudim',
  'md-films': 'mdFilms',
  'if-make': 'ifMake',
  gymflow: 'gymflow',
  'codementor-ia': 'codementorIa',
};

// Add real images from public/projects to screenshots; the first one becomes the cover.
export const PROJECTS: Project[] = [
  {
    id: 'js-boy',
    screenshots: [],
    title: 'JS BOY',
    status: 'staging',
    technologies: ['Java 21', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Flyway'],
    githubUrl: 'https://github.com/CA10V1ANA/js-boy',
    featured: true,
  },
  {
    id: 'sonho-de-pudim',
    screenshots: [],
    title: 'Sonho de Pudim',
    status: 'deployed',
    technologies: ['Angular 22', 'TypeScript', 'Signals', 'SCSS', 'Vercel'],
    githubUrl: 'https://github.com/CA10V1ANA/sonho-de-pudim',
    demoUrl: 'https://sonho-de-pudim.vercel.app',
    featured: true,
  },
  {
    id: 'md-films',
    screenshots: [],
    title: 'Madu Films',
    status: 'active',
    technologies: ['Angular 22', 'TypeScript', 'Angular Router', 'SCSS', 'Vercel'],
    githubUrl: 'https://github.com/CA10V1ANA/Md-films',
    demoUrl: 'https://md-films-sigma.vercel.app',
    featured: true,
  },
  {
    id: 'if-make',
    screenshots: [],
    title: 'IF Make',
    status: 'deployed',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    demoUrl: 'https://if-make.vercel.app/',
    featured: true,
  },
  {
    id: 'gymflow',
    title: 'GymFlow Pro',
    status: 'study',
    technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
    githubUrl: 'https://github.com/CA10V1ANA/GymFlow',
    featured: false,
  },
  {
    id: 'codementor-ia',
    title: 'CodeMentor IA',
    status: 'study',
    technologies: ['Python', 'Flask', 'SQLite', 'JavaScript'],
    githubUrl: 'https://github.com/CA10V1ANA/CodeMentor-IA',
    featured: false,
  },
];
