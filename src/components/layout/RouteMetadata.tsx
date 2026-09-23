import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PROJECTS } from '@/data/projects';
import { PAGES } from '@/lib/constants';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.append(tag);
  }
  tag.content = content;
}

export function RouteMetadata() {
  const { pathname } = useLocation();
  const slug = pathname.split('/').at(-1);
  const project = pathname.startsWith('/projetos/') ? PROJECTS.find((item) => item.id === slug) : undefined;
  const page = PAGES.find((item) => item.path === pathname);
  const knownProjectPath = pathname.startsWith('/projetos/');
  const title = project
    ? `${project.title} — Case Full Stack | Caio Viana`
    : page?.title ?? (knownProjectPath ? 'Projeto não encontrado — Caio Viana' : 'Página não encontrada — Caio Viana');
  const description = project
    ? `${project.description} Tecnologias: ${project.technologies.join(', ')}.`
    : page?.description ?? 'A página solicitada não foi encontrada no portfólio de Caio Viana.';

  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${window.location.origin}${window.location.pathname}`);
    setMeta('property', 'og:image', new URL(`${import.meta.env.BASE_URL}og-image.png`, window.location.origin).href);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', new URL(`${import.meta.env.BASE_URL}og-image.png`, window.location.origin).href);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}`;
  }, [description, pathname, title]);

  return null;
}
