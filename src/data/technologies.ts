import { Code2, Database, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons';
import { GiBearFace } from 'react-icons/gi';
import { GrOracle } from 'react-icons/gr';
import {
  SiApachegroovy,
  SiApachemaven,
  SiAxios,
  SiCss,
  SiFlyway,
  SiGit,
  SiGithub,
  SiHibernate,
  SiHtml5,
  SiInsomnia,
  SiJavascript,
  SiJsonwebtokens,
  SiJunit5,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiReact,
  SiReacthookform,
  SiReactrouter,
  SiRedux,
  SiSpringboot,
  SiSpringsecurity,
  SiSwagger,
  SiTestinglibrary,
  SiTypescript,
  SiVite,
  SiVitest,
  SiZod,
} from 'react-icons/si';
import { TbApi, TbContainer, TbTestPipe } from 'react-icons/tb';

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
  { id: 'tooling', gitLabel: 'chore/tooling-qa', icon: Wrench },
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
  entry('react', 'React', 'frontend', 1, SiReact),
  entry('typescript', 'TypeScript', 'frontend', 2, SiTypescript),
  entry('javascript', 'JavaScript', 'frontend', 3, SiJavascript),
  entry('html', 'HTML5', 'frontend', 4, SiHtml5),
  entry('css', 'CSS3', 'frontend', 5, SiCss),
  entry('vite', 'Vite', 'frontend', 6, SiVite),
  entry('react-router', 'React Router', 'frontend', 7, SiReactrouter),
  entry('axios', 'Axios', 'frontend', 8, SiAxios),
  entry('zustand', 'Zustand', 'frontend', 9, GiBearFace),
  entry('redux', 'Redux', 'frontend', 10, SiRedux),
  entry('react-hook-form', 'React Hook Form', 'frontend', 11, SiReacthookform),
  entry('zod', 'Zod', 'frontend', 12, SiZod),

  entry('java', 'Java', 'backend', 13, SiOpenjdk),
  entry('spring-boot', 'Spring Boot', 'backend', 14, SiSpringboot),
  entry('spring-security', 'Spring Security', 'backend', 15, SiSpringsecurity),
  entry('jwt', 'JWT', 'backend', 16, SiJsonwebtokens),
  entry('groovy-grails', 'Groovy / Grails', 'backend', 17, SiApachegroovy),
  entry('nodejs', 'Node.js', 'backend', 18, SiNodedotjs),
  entry('nestjs', 'NestJS', 'backend', 19, SiNestjs),
  entry('rest-apis', 'APIs REST', 'backend', 20, TbApi),
  entry('python', 'Python', 'backend', 21, SiPython),

  entry('postgresql', 'PostgreSQL', 'data', 22, SiPostgresql),
  entry('oracle', 'Oracle', 'data', 23, GrOracle),
  entry('mysql', 'MySQL', 'data', 24, SiMysql),
  entry('spring-data-jpa', 'Spring Data JPA', 'data', 25, SiHibernate),
  entry('flyway', 'Flyway', 'data', 26, SiFlyway),

  entry('git', 'Git', 'tooling', 27, SiGit),
  entry('github', 'GitHub', 'tooling', 28, SiGithub),
  entry('maven', 'Maven', 'tooling', 29, SiApachemaven),
  entry('swagger', 'Swagger / OpenAPI', 'tooling', 30, SiSwagger),
  entry('insomnia', 'Insomnia', 'tooling', 31, SiInsomnia),
  entry('junit5', 'JUnit 5', 'tooling', 32, SiJunit5),
  entry('mockito', 'Mockito', 'tooling', 33, TbTestPipe),
  entry('testcontainers', 'Testcontainers', 'tooling', 34, TbContainer),
  entry('vitest', 'Vitest', 'tooling', 35, SiVitest),
  entry('react-testing-library', 'React Testing Library', 'tooling', 36, SiTestinglibrary),
];
