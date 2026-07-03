import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'delivery-system',
    title: 'Sistema de Delivery',
    description:
      'Plataforma completa de pedidos com carrinho, cálculo de frete, acompanhamento de status e painel administrativo para restaurantes.',
    image: '/projects/delivery.jpg',
    technologies: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/CA10V1ANA',
    demoUrl: undefined,
    featured: true,
  },
  {
    id: 'financial-system',
    title: 'Sistema Financeiro',
    description:
      'Aplicação para controle de receitas e despesas, dashboards com gráficos, categorização de transações e relatórios exportáveis.',
    image: '/projects/financeiro.jpg',
    technologies: ['React', 'Java', 'Spring Boot', 'PostgreSQL'],
    githubUrl: 'https://github.com/CA10V1ANA',
    demoUrl: undefined,
    featured: true,
  },
  {
    id: 'pomodoro-app',
    title: 'Pomodoro Timer',
    description:
      'Aplicativo de produtividade baseado na técnica Pomodoro, com ciclos configuráveis, notificações e histórico de sessões.',
    image: '/projects/pomodoro.jpg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/CA10V1ANA',
    demoUrl: undefined,
  },
  {
    id: 'spring-boot-api',
    title: 'API REST — Spring Boot',
    description:
      'API RESTful robusta com autenticação JWT, documentação Swagger, validações e arquitetura em camadas seguindo boas práticas.',
    image: '/projects/api-springboot.jpg',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/CA10V1ANA',
    demoUrl: undefined,
  },
  {
    id: 'library-system',
    title: 'Sistema de Biblioteca',
    description:
      'Gerenciamento de acervo, empréstimos e devoluções, controle de usuários e notificações de prazos com regras de negócio completas.',
    image: '/projects/biblioteca.jpg',
    technologies: ['Java', 'Spring Boot', 'MySQL'],
    githubUrl: 'https://github.com/CA10V1ANA',
    demoUrl: undefined,
  },
  {
    id: 'portfolio',
    title: 'Portfólio Pessoal',
    description:
      'Este portfólio: uma aplicação React 19 moderna com animações, tema escuro, integração com a API do GitHub e formulário de contato.',
    image: '/projects/portfolio.jpg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/CA10V1ANA/Portf-lio',
    demoUrl: undefined,
    featured: true,
  },
];
