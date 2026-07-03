import type { ExperienceItem } from '@/types';

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'acs',
    role: 'Desenvolvedor Full Stack',
    company: 'ACS Automação Comercial e Sistemas',
    location: 'Fortaleza, Ceará',
    startDate: '2024-01',
    current: true,
    description: [
      'Desenvolvimento e manutenção de sistemas corporativos utilizando Java e Spring Boot.',
      'Construção de interfaces modernas e responsivas com React e TypeScript.',
      'Modelagem e otimização de bancos de dados relacionais em PostgreSQL.',
      'Participação em todo o ciclo de vida do software: levantamento de requisitos, desenvolvimento, testes e deploy.',
      'Colaboração em equipe utilizando Git e metodologias ágeis.',
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Git', 'Docker'],
  },
];
