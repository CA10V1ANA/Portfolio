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
  order: number;
  icon: IconType;
}

export const BRANCHES: Array<{
  id: StackBranch;
  gitLabel: string;
  icon: LucideIcon;
}> = [
  { id: 'frontend', gitLabel: 'feat/frontend', icon: Code2 },
  { id: 'backend', gitLabel: 'feat/backend', icon: Code2 },
  { id: 'data', gitLabel: 'feat/data-layer', icon: Database },
  { id: 'tooling', gitLabel: 'chore/tooling', icon: Wrench },
];

const entry = (
  id: string,
  name: string,
  branch: StackBranch,
  order: number,
  icon: IconType,
): PortfolioTechnology => ({
  id,
  name,
  branch,
  order,
  icon,
});

export const TECHNOLOGIES: PortfolioTechnology[] = [
  entry('angular', 'Angular', 'frontend', 1, SiAngular),
  entry('react', 'React', 'frontend', 2, SiReact),
  entry('typescript', 'TypeScript', 'frontend', 3, SiTypescript),
  entry('javascript', 'JavaScript', 'frontend', 4, SiJavascript),
  entry('html', 'HTML', 'frontend', 5, SiHtml5),
  entry('css', 'CSS / SCSS', 'frontend', 6, SiSass),
  entry('java', 'Java', 'backend', 7, SiOpenjdk),
  entry('kotlin', 'Kotlin', 'backend', 8, SiKotlin),
  entry('spring-boot', 'Spring Boot', 'backend', 9, SiSpringboot),
  entry('grails', 'Grails', 'backend', 10, DiGrails),
  entry('nestjs', 'NestJS', 'backend', 11, SiNestjs),
  entry('nodejs', 'Node.js', 'backend', 12, SiNodedotjs),
  entry('postgresql', 'PostgreSQL', 'data', 13, SiPostgresql),
  entry('oracle', 'Oracle', 'data', 14, GrOracle),
  entry('jpa-hibernate', 'JPA / Hibernate', 'data', 15, SiHibernate),
  entry('docker', 'Docker', 'tooling', 16, SiDocker),
  entry('git', 'Git', 'tooling', 17, SiGit),
  entry('github', 'GitHub', 'tooling', 18, SiGithub),
  entry('swagger', 'Swagger / OpenAPI', 'tooling', 19, SiOpenapiinitiative),
  entry('maven', 'Maven', 'tooling', 20, SiApachemaven),
  entry('vite', 'Vite', 'tooling', 21, SiVite),
];
