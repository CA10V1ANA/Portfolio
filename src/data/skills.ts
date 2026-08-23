import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiVite,
  SiNextdotjs,
  SiVuedotjs,
  SiFlutter,
  SiDart,
  SiSpring,
  SiNodedotjs,
  SiNestjs,
  SiPhp,
  SiLaravel,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
  SiSwagger,
  SiVercel,
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';
import { TbApi } from 'react-icons/tb';
import type { Skill } from '@/types';

export const SKILLS: Skill[] = [
  // Frontend
  { name: 'React', category: 'frontend', level: 90, icon: SiReact, color: '#61DAFB' },
  { name: 'TypeScript', category: 'frontend', level: 88, icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', category: 'frontend', level: 92, icon: SiJavascript, color: '#F7DF1E' },
  { name: 'HTML5', category: 'frontend', level: 95, icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', category: 'frontend', level: 90, icon: SiCss, color: '#1572B6' },
  { name: 'Tailwind CSS', category: 'frontend', level: 88, icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Vite', category: 'frontend', level: 85, icon: SiVite, color: '#646CFF' },
  { name: 'Next.js', category: 'frontend', level: 75, icon: SiNextdotjs, color: '#ffffff' },
  { name: 'Vue.js', category: 'frontend', level: 70, icon: SiVuedotjs, color: '#4FC08D' },
  { name: 'Flutter', category: 'frontend', level: 75, icon: SiFlutter, color: '#02569B' },
  { name: 'Dart', category: 'frontend', level: 72, icon: SiDart, color: '#0175C2' },

  // Backend
  { name: 'Java', category: 'backend', level: 90, icon: FaJava, color: '#E76F00' },
  { name: 'Spring Boot', category: 'backend', level: 85, icon: SiSpring, color: '#6DB33F' },
  { name: 'Node.js', category: 'backend', level: 78, icon: SiNodedotjs, color: '#339933' },
  { name: 'NestJS', category: 'backend', level: 75, icon: SiNestjs, color: '#E0234E' },
  { name: 'PHP 8', category: 'backend', level: 70, icon: SiPhp, color: '#777BB4' },
  { name: 'Laravel', category: 'backend', level: 68, icon: SiLaravel, color: '#FF2D20' },
  { name: 'Python', category: 'backend', level: 70, icon: SiPython, color: '#3776AB' },
  { name: 'REST APIs', category: 'backend', level: 88, icon: TbApi, color: '#38BDF8' },

  // Database
  { name: 'PostgreSQL', category: 'database', level: 85, icon: SiPostgresql, color: '#4169E1' },
  { name: 'MySQL', category: 'database', level: 80, icon: SiMysql, color: '#4479A1' },
  { name: 'SQLite', category: 'database', level: 75, icon: SiSqlite, color: '#003B57' },

  // Tools
  { name: 'Git', category: 'tools', level: 90, icon: SiGit, color: '#F05032' },
  { name: 'GitHub', category: 'tools', level: 90, icon: SiGithub, color: '#ffffff' },
  { name: 'Docker', category: 'tools', level: 78, icon: SiDocker, color: '#2496ED' },
  { name: 'Postman', category: 'tools', level: 85, icon: SiPostman, color: '#FF6C37' },
  { name: 'Swagger/OpenAPI', category: 'tools', level: 80, icon: SiSwagger, color: '#85EA2D' },

  // Cloud
  { name: 'AWS', category: 'cloud', level: 60, icon: FaAws, color: '#FF9900' },
  { name: 'Vercel', category: 'cloud', level: 82, icon: SiVercel, color: '#ffffff' },
];

export const SKILL_CATEGORIES: { key: Skill['category']; label: string }[] = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Banco de Dados' },
  { key: 'tools', label: 'Ferramentas' },
  { key: 'cloud', label: 'Cloud' },
];
