import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'js-boy',
    title: 'JS BOY',
    subtitle: 'Gestão de Entregas Empresariais',
    category: 'Projeto real · Full Stack',
    status: 'staging',
    statusLabel: 'Em homologação',
    context: 'Projeto real · Full Stack',
    description:
      'Plataforma para organizar a operação de uma empresa familiar de entregas empresariais, com gestão de clientes, entregadores, pedidos, preços e acompanhamento operacional.',
    problem:
      'Processos manuais e informações descentralizadas dificultavam o acompanhamento das entregas.',
    contribution:
      'Desenvolvimento da aplicação web, API e base de dados, com autenticação por perfil e evolução contínua do fluxo operacional.',
    technologies: ['Java 21', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Flyway'],
    githubUrl: 'https://github.com/CA10V1ANA/js-boy',
    // O endereço de homologação do briefing retornava 404 na verificação registrada no README.
    featured: true,
  },
  {
    id: 'pokedex',
    title: 'Pokédex — Pokémon Explorer',
    subtitle: 'Catálogo interativo de Pokémon',
    category: 'Projeto de estudo · Frontend',
    status: 'deployed',
    statusLabel: 'Concluído',
    context: 'Projeto de estudo · Frontend',
    description:
      'Pokédex moderna e responsiva para explorar, pesquisar, filtrar e favoritar Pokémon consumindo dados da PokéAPI em tempo real.',
    problem:
      'Organizar uma grande quantidade de informações da PokéAPI em uma experiência rápida, visual e fácil de explorar.',
    contribution:
      'Desenvolvimento da aplicação Angular, arquitetura de componentes, estado reativo com Signals, integração com a PokéAPI, persistência de favoritos e testes unitários.',
    technologies: ['Angular 19', 'TypeScript', 'Signals', 'SCSS', 'PokéAPI', 'Vitest'],
    githubUrl: 'https://github.com/CA10V1ANA/Pokedex',
    demoUrl: 'https://ca10v1ana.github.io/Pokedex/',
    featured: true,
  },
  {
    id: 'if-make',
    title: 'IF Make',
    subtitle: 'Portfólio de Social Media',
    category: 'Projeto para cliente',
    status: 'deployed',
    statusLabel: 'Publicado',
    context: 'Projeto para cliente',
    description:
      'Site para apresentar os serviços, trabalhos e posicionamento profissional de uma cliente de social media.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    demoUrl: 'https://if-make.vercel.app/',
    featured: true,
  },
  {
    id: 'devpilot',
    title: 'DevPilot',
    subtitle: 'Agente de apoio à liderança técnica',
    category: 'AI Engineering',
    status: 'active',
    statusLabel: 'Em desenvolvimento',
    context: 'AI Engineering',
    description:
      'Agente pessoal criado para apoiar decisões técnicas durante um hackathon, com planejamento, debugging, revisão de código e controle de contexto por projeto.',
    technologies: ['TypeScript', 'Runtime local'],
    featured: true,
  },
  {
    id: 'gymflow',
    title: 'GymFlow Pro',
    subtitle: 'Gestão de academias',
    category: 'Projeto Full Stack',
    status: 'study',
    statusLabel: 'Projeto',
    description: 'Sistema de gestão de academias com alunos, matrículas, treinos e financeiro.',
    technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
    githubUrl: 'https://github.com/CA10V1ANA/GymFlow',
    featured: false,
  },
  {
    id: 'codementor-ia',
    title: 'CodeMentor IA',
    subtitle: 'Chat acadêmico de programação',
    category: 'Projeto de estudo',
    status: 'study',
    statusLabel: 'Projeto',
    description:
      'Chat para apoio ao estudo de programação com histórico local e respostas em Markdown.',
    technologies: ['Python', 'Flask', 'SQLite', 'JavaScript'],
    githubUrl: 'https://github.com/CA10V1ANA/CodeMentor-IA',
    featured: false,
  },
];
