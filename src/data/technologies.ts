import { FaJava } from 'react-icons/fa';
import { SiAngular, SiDocker, SiPostgresql, SiReact, SiSpring, SiTypescript } from 'react-icons/si';
import type { Technology } from '@/types';

export const TECHNOLOGIES: Technology[] = [
  { name: 'Java', category: 'Backend', context: 'APIs e aplicações corporativas', icon: FaJava },
  {
    name: 'Spring Boot',
    category: 'Backend',
    context: 'Serviços REST e projeto JS BOY',
    icon: SiSpring,
  },
  {
    name: 'Angular',
    category: 'Frontend',
    context: 'WindOps e projetos de estudo',
    icon: SiAngular,
  },
  {
    name: 'React',
    category: 'Frontend',
    context: 'Interfaces web e projetos Full Stack',
    icon: SiReact,
  },
  {
    name: 'TypeScript',
    category: 'Linguagem',
    context: 'Interfaces e serviços com tipagem estática',
    icon: SiTypescript,
  },
  {
    name: 'PostgreSQL',
    category: 'Dados',
    context: 'Persistência de aplicações Full Stack',
    icon: SiPostgresql,
  },
  {
    name: 'Docker',
    category: 'Infraestrutura',
    context: 'Ambientes de desenvolvimento e serviços',
    icon: SiDocker,
  },
];
