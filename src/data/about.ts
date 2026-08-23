import type { AboutHighlight, TimelineEntry } from '@/types';

export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    icon: 'Code2',
    title: 'Full Stack Development',
    description:
      'Construo soluções completas, do banco de dados à interface, com foco em performance e código limpo.',
  },
  {
    icon: 'GraduationCap',
    title: 'Formação Sólida',
    description:
      'Estudante de Engenharia de Software no UniAteneu, aplicando fundamentos de arquitetura e boas práticas no dia a dia.',
  },
  {
    icon: 'Layers',
    title: 'Stack Moderna',
    description:
      'Java, Spring Boot, React, TypeScript e Flutter para construir produtos robustos para web e mobile.',
  },
  {
    icon: 'Users',
    title: 'Trabalho em Equipe',
    description:
      'Experiência colaborando em equipes ágeis, com versionamento Git e comunicação clara em todo o ciclo de desenvolvimento.',
  },
];

export const ABOUT_TIMELINE: TimelineEntry[] = [
  {
    id: 'primeiros-projetos',
    date: 'Projetos próprios',
    title: 'Primeiros Projetos',
    subtitle: 'Java, React e Banco de Dados',
    description:
      'Desenvolvimento de projetos pessoais e acadêmicos utilizando Java, Spring Boot, React e PostgreSQL.',
  },
  {
    id: 'rav-full-stack',
    date: 'Ago 2025 — atual',
    title: 'Desenvolvedor Full Stack',
    subtitle: 'RAV Tecnologia',
    description:
      'Atuação profissional desenvolvendo e mantendo sistemas corporativos com Java, Spring Boot, React e TypeScript.',
  },
  {
    id: 'inicio-graduacao',
    date: 'Fev 2026 — atual',
    title: 'Início da Graduação',
    subtitle: 'Engenharia de Software — UniAteneu',
    description:
      'Início dos estudos em Engenharia de Software, com foco em lógica, algoritmos e fundamentos de programação.',
  },
  {
    id: 'evolucao-continua',
    date: 'Presente',
    title: 'Evolução Contínua',
    subtitle: 'Flutter, Docker e Cloud',
    description:
      'Evolução em aplicações web e mobile, contêinerização com Docker, segurança e arquitetura de software.',
  },
];
