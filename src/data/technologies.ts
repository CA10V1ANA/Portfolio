import { Code2, Database, GitBranch, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type StackBranch = 'frontend' | 'backend' | 'data' | 'tooling';
export interface PortfolioTechnology {
  id: string;
  name: string;
  branch: StackBranch;
  branchLabel: string;
  context: string;
  order: number;
  icon: LucideIcon;
}

export const BRANCHES: Array<{ id: StackBranch; label: string; gitLabel: string; icon: LucideIcon }> = [
  { id: 'frontend', label: 'Frontend', gitLabel: 'feat/frontend', icon: Code2 },
  { id: 'backend', label: 'Backend', gitLabel: 'feat/backend', icon: Code2 },
  { id: 'data', label: 'Dados e Persistência', gitLabel: 'feat/data-layer', icon: Database },
  { id: 'tooling', label: 'Ferramentas', gitLabel: 'chore/tooling', icon: Wrench },
];

const entry = (id: string, name: string, branch: StackBranch, context: string, order: number): PortfolioTechnology => ({
  id, name, branch, branchLabel: BRANCHES.find((item) => item.id === branch)!.gitLabel, context, order,
  icon: branch === 'data' ? Database : branch === 'tooling' ? GitBranch : Code2,
});

export const TECHNOLOGIES: PortfolioTechnology[] = [
  entry('angular', 'Angular', 'frontend', 'Interfaces corporativas e aplicações operacionais.', 1),
  entry('react', 'React', 'frontend', 'Interfaces web em projetos Full Stack.', 2),
  entry('typescript', 'TypeScript', 'frontend', 'Aplicações web e serviços com tipagem estática.', 3),
  entry('javascript', 'JavaScript', 'frontend', 'Desenvolvimento de aplicações web.', 4),
  entry('html', 'HTML', 'frontend', 'Estrutura de interfaces web.', 5),
  entry('css', 'CSS / SCSS', 'frontend', 'Estilização de interfaces e aplicações Angular.', 6),
  entry('java', 'Java', 'backend', 'Aplicações corporativas e APIs.', 7),
  entry('kotlin', 'Kotlin', 'backend', 'Desenvolvimento backend.', 8),
  entry('spring-boot', 'Spring Boot', 'backend', 'Serviços REST e aplicações corporativas.', 9),
  entry('grails', 'Grails', 'backend', 'Desenvolvimento de sistemas backend.', 10),
  entry('nestjs', 'NestJS', 'backend', 'APIs REST com TypeScript.', 11),
  entry('nodejs', 'Node.js', 'backend', 'Runtime para aplicações e serviços TypeScript.', 12),
  entry('postgresql', 'PostgreSQL', 'data', 'Persistência relacional em aplicações Full Stack.', 13),
  entry('oracle', 'Oracle', 'data', 'Banco de dados relacional em sistemas corporativos.', 14),
  entry('jpa-hibernate', 'JPA / Hibernate', 'data', 'Mapeamento objeto-relacional para aplicações Java.', 15),
  entry('docker', 'Docker', 'tooling', 'Ambientes de desenvolvimento e serviços.', 16),
  entry('git', 'Git', 'tooling', 'Versionamento e colaboração em código.', 17),
  entry('github', 'GitHub', 'tooling', 'Hospedagem de código e colaboração.', 18),
  entry('swagger', 'Swagger / OpenAPI', 'tooling', 'Documentação de APIs REST.', 19),
  entry('maven', 'Maven', 'tooling', 'Build e dependências em projetos Java.', 20),
  entry('vite', 'Vite', 'tooling', 'Ferramentas de desenvolvimento frontend.', 21),
];
