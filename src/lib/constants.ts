export const PERSONAL_INFO = {
  name: 'Caio de Oliveira Viana',
  firstName: 'Caio',
  title: 'Full Stack Developer',
  subtitle: 'Software Engineering Student',
  email: 'vianacaio009@gmail.com',
  location: 'Fortaleza, Ceará, Brasil',
  roles: [
    'Full Stack Developer',
    'Java Developer',
    'React Developer',
    'Software Engineering Student',
  ],
  resumeUrl: '/resume-caio-viana.pdf',
  avatarUrl: '/avatar.jpg',
};

export const SOCIAL_LINKS = {
  github: 'https://github.com/CA10V1ANA',
  linkedin: 'https://www.linkedin.com/in/caio-viana-898811312',
  email: `mailto:${PERSONAL_INFO.email}`,
};

export const GITHUB_USERNAME = 'CA10V1ANA';

export const NAV_LINKS = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experiência', href: '#experience' },
  { label: 'Projetos', href: '#projects' },
  { label: 'Certificados', href: '#certificates' },
  { label: 'Formação', href: '#education' },
  { label: 'GitHub', href: '#github' },
  { label: 'Contato', href: '#contact' },
];

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
};
