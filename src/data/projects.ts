import type { Project } from '@/types';

/**
 * Translation key mapping for each project.
 * Keys reference the `projects` namespace in i18n files.
 */
export const PROJECT_I18N_MAP: Record<string, string> = {
  'js-boy': 'jsBoy',
  pokedex: 'pokedex',
  'if-make': 'ifMake',
  devpilot: 'devpilot',
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
    id: 'pokedex',
    screenshots: [],
    title: 'Pokédex — Pokémon Explorer',
    status: 'deployed',
    technologies: ['Angular 19', 'TypeScript', 'Signals', 'SCSS', 'PokéAPI', 'Vitest'],
    githubUrl: 'https://github.com/CA10V1ANA/Pokedex',
    demoUrl: 'https://ca10v1ana.github.io/Pokedex/',
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
    id: 'devpilot',
    screenshots: [],
    title: 'DevPilot',
    status: 'active',
    technologies: ['TypeScript', 'Runtime local'],
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
