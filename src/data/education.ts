import type { EducationItem } from '@/types';

export const EDUCATION: EducationItem[] = [
  {
    id: 'uniateneu',
    institution: 'UniAteneu — Centro Universitário Ateneu',
    degree: 'Bacharelado',
    field: 'Engenharia de Software',
    startDate: '2026-02',
    current: true,
    description:
      'Formação com foco em engenharia de software, arquitetura de sistemas, estrutura de dados, banco de dados, desenvolvimento web e boas práticas de programação.',
  },
  {
    id: 'eeep-marwin',
    institution: 'EEEP Marwin',
    degree: 'Ensino Médio e Técnico Integrado',
    field: 'Desenvolvimento de Sistemas',
    startDate: '2023',
    endDate: '2025',
    description:
      'Formação técnica integrada ao ensino médio, com fundamentos de programação e desenvolvimento de sistemas.',
  },
];
