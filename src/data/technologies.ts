import { Code2, Database, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DiGrails } from 'react-icons/di';
import { GrOracle } from 'react-icons/gr';
import {
  SiAngular,
  SiApachemaven,
  SiDocker,
  SiGit,
  SiGithub,
  SiHibernate,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiNestjs,
  SiNodedotjs,
  SiOpenapiinitiative,
  SiOpenjdk,
  SiPostgresql,
  SiReact,
  SiSass,
  SiSpringboot,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

export type StackBranch = 'frontend' | 'backend' | 'data' | 'tooling';

export interface PortfolioTechnology {
  id: string;
  name: string;
  branch: StackBranch;
  branchLabel: string;
  context: string;
  order: number;
  icon: IconType;
}

export const STACK_COPY = {
  eyebrow: '04 / Ecossistema técnico',
  title: 'Stack Branch Orbit',
  introduction:
    'Tecnologias organizadas por camada. Cada branch parte da integração Full Stack e retorna à main.',
  mainBranch: 'Branch principal: main, integração Full Stack',
  mainTitle: 'Full Stack Integration',
  branchSelector: 'Selecionar branch técnica',
  technologySelector: 'Tecnologias da branch',
  head: 'HEAD',
} as const;

export const BRANCHES: Array<{
  id: StackBranch;
  label: string;
  gitLabel: string;
  icon: LucideIcon;
}> = [
  { id: 'frontend', label: 'Frontend', gitLabel: 'feat/frontend', icon: Code2 },
  { id: 'backend', label: 'Backend', gitLabel: 'feat/backend', icon: Code2 },
  { id: 'data', label: 'Dados e Persistência', gitLabel: 'feat/data-layer', icon: Database },
  { id: 'tooling', label: 'Ferramentas', gitLabel: 'chore/tooling', icon: Wrench },
];

const entry = (
  id: string,
  name: string,
  branch: StackBranch,
  context: string,
  order: number,
  icon: IconType,
): PortfolioTechnology => ({
  id,
  name,
  branch,
  branchLabel: BRANCHES.find((item) => item.id === branch)!.gitLabel,
  context,
  order,
  icon,
});

export const TECHNOLOGIES: PortfolioTechnology[] = [
  entry(
    'angular',
    'Angular',
    'frontend',
    'Interfaces corporativas e aplicações operacionais.',
    1,
    SiAngular,
  ),
  entry('react', 'React', 'frontend', 'Interfaces web em projetos Full Stack.', 2, SiReact),
  entry(
    'typescript',
    'TypeScript',
    'frontend',
    'Aplicações web e serviços com tipagem estática.',
    3,
    SiTypescript,
  ),
  entry(
    'javascript',
    'JavaScript',
    'frontend',
    'Desenvolvimento de aplicações web.',
    4,
    SiJavascript,
  ),
  entry('html', 'HTML', 'frontend', 'Estrutura de interfaces web.', 5, SiHtml5),
  entry(
    'css',
    'CSS / SCSS',
    'frontend',
    'Estilização de interfaces e aplicações Angular.',
    6,
    SiSass,
  ),
  entry('java', 'Java', 'backend', 'Aplicações corporativas e APIs.', 7, SiOpenjdk),
  entry('kotlin', 'Kotlin', 'backend', 'Desenvolvimento backend.', 8, SiKotlin),
  entry(
    'spring-boot',
    'Spring Boot',
    'backend',
    'Serviços REST e aplicações corporativas.',
    9,
    SiSpringboot,
  ),
  entry('grails', 'Grails', 'backend', 'Desenvolvimento de sistemas backend.', 10, DiGrails),
  entry('nestjs', 'NestJS', 'backend', 'APIs REST com TypeScript.', 11, SiNestjs),
  entry(
    'nodejs',
    'Node.js',
    'backend',
    'Runtime para aplicações e serviços TypeScript.',
    12,
    SiNodedotjs,
  ),
  entry(
    'postgresql',
    'PostgreSQL',
    'data',
    'Persistência relacional em aplicações Full Stack.',
    13,
    SiPostgresql,
  ),
  entry(
    'oracle',
    'Oracle',
    'data',
    'Banco de dados relacional em sistemas corporativos.',
    14,
    GrOracle,
  ),
  entry(
    'jpa-hibernate',
    'JPA / Hibernate',
    'data',
    'Mapeamento objeto-relacional para aplicações Java.',
    15,
    SiHibernate,
  ),
  entry('docker', 'Docker', 'tooling', 'Ambientes de desenvolvimento e serviços.', 16, SiDocker),
  entry('git', 'Git', 'tooling', 'Versionamento e colaboração em código.', 17, SiGit),
  entry('github', 'GitHub', 'tooling', 'Hospedagem de código e colaboração.', 18, SiGithub),
  entry(
    'swagger',
    'Swagger / OpenAPI',
    'tooling',
    'Documentação de APIs REST.',
    19,
    SiOpenapiinitiative,
  ),
  entry('maven', 'Maven', 'tooling', 'Build e dependências em projetos Java.', 20, SiApachemaven),
  entry('vite', 'Vite', 'tooling', 'Ferramentas de desenvolvimento frontend.', 21, SiVite),
];
