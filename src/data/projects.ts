import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'js-boy',
    title: 'JS Boy — Gestão de Entregas',
    description:
      'Plataforma operacional para gestão de entregas, clientes, entregadores, pagamentos e financeiro, com painel web, API e aplicativo móvel integrados.',
    image: 'https://opengraph.githubassets.com/portfolio/CA10V1ANA/js-boy',
    technologies: ['React', 'TypeScript', 'Java 21', 'Spring Boot', 'PostgreSQL', 'Flutter'],
    githubUrl: 'https://github.com/CA10V1ANA/js-boy',
    demoUrl: undefined,
    featured: true,
  },
  {
    id: 'gymflow',
    title: 'GymFlow Pro',
    description:
      'Sistema completo de gestão de academias com alunos, matrículas, treinos, frequência, financeiro, estoque, autenticação JWT e controle por perfis.',
    image: 'https://opengraph.githubassets.com/portfolio/CA10V1ANA/GymFlow',
    technologies: ['React', 'TypeScript', 'Java 21', 'Spring Boot', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/CA10V1ANA/GymFlow',
    demoUrl: undefined,
    featured: true,
  },
  {
    id: 'codementor-ia',
    title: 'CodeMentor IA',
    description:
      'Chat acadêmico com IA especializado em programação, histórico em SQLite, upload de códigos e imagens e respostas formatadas em Markdown.',
    image: 'https://opengraph.githubassets.com/portfolio/CA10V1ANA/CodeMentor-IA',
    technologies: ['Python', 'Flask', 'SQLite', 'JavaScript', 'OpenRouter API'],
    githubUrl: 'https://github.com/CA10V1ANA/CodeMentor-IA',
    demoUrl: undefined,
    featured: true,
  },
  {
    id: 'chronos-pomodoro',
    title: 'Chronos Pomodoro',
    description:
      'Aplicação de produtividade baseada na técnica Pomodoro, desenvolvida com React e TypeScript para organizar ciclos de foco e descanso.',
    image: 'https://opengraph.githubassets.com/portfolio/CA10V1ANA/Chronos-Pomodoro',
    technologies: ['React', 'TypeScript', 'Vite'],
    githubUrl: 'https://github.com/CA10V1ANA/Chronos-Pomodoro',
    demoUrl: undefined,
  },
  {
    id: 'portfolio',
    title: 'Portfólio Pessoal',
    description:
      'Aplicação React responsiva com animações, temas claro e escuro, integração dinâmica com o GitHub e formulário de contato.',
    image: 'https://opengraph.githubassets.com/portfolio/CA10V1ANA/Portfolio',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    githubUrl: 'https://github.com/CA10V1ANA/Portfolio',
    demoUrl: undefined,
  },
];
