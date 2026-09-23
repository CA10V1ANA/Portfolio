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
  subtitle: string;
  category: string;
  status: 'staging' | 'deployed' | 'active' | 'study' | 'archived';
  statusLabel: string;
  description: string;
  context?: string;
  solution?: string;
  problem?: string;
  contribution?: string;
  image?: string;
  imageAlt?: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  docsUrl?: string;
  screenshots?: Array<{ src: string; alt: string }>;
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string[];
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
