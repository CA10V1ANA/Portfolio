import type { IconType } from 'react-icons';

export interface Technology {
  name: string;
  category: string;
  context: string;
  icon: IconType;
}

export interface Project {
  id: string;
  title: string;
  status: 'staging' | 'deployed' | 'active' | 'study' | 'archived';
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  docsUrl?: string;
  screenshots?: Array<{ src: string; alt: string }>;
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
