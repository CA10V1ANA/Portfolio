import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PROJECTS, PROJECT_I18N_MAP } from '@/data/projects';
import { ROUTE_SEO_MAP } from '@/lib/constants';

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
  const { t: tp, i18n } = useTranslation('pages');
  const { t: tProj } = useTranslation('projects');
  const { t: ts } = useTranslation('stack');

  const slug = pathname.split('/').at(-1);
  const project = pathname.startsWith('/projetos/') ? PROJECTS.find((item) => item.id === slug) : undefined;
  const seoEntry = ROUTE_SEO_MAP[pathname];
  const knownProjectPath = pathname.startsWith('/projetos/');

  let title: string;
  let description: string;

  if (project) {
    const i18nKey = PROJECT_I18N_MAP[project.id] ?? project.id;
    title = `${project.title} — ${tp('projectSeo.caseSuffix')}`;
    description = `${tProj(`${i18nKey}.description`)} ${tp('projectSeo.techPrefix')} ${project.technologies.join(', ')}.`;
  } else if (seoEntry) {
    if (seoEntry.titleKey.startsWith('stack:')) {
      title = ts(seoEntry.titleKey.replace('stack:', ''));
      description = ts(seoEntry.descKey.replace('stack:', ''));
    } else {
      title = tp(seoEntry.titleKey);
      description = tp(seoEntry.descKey);
    }
  } else if (knownProjectPath) {
    title = tp('projectSeo.notFoundTitle');
    description = tp('projectSeo.notFoundDesc');
  } else {
    title = tp('notFound.seo.title');
    description = tp('notFound.seo.description');
  }

  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${window.location.origin}${window.location.pathname}`);
    setMeta('property', 'og:image', new URL(`${import.meta.env.BASE_URL}og-image.png`, window.location.origin).href);
    setMeta('property', 'og:locale', i18n.language === 'pt-BR' ? 'pt_BR' : i18n.language === 'es' ? 'es_ES' : 'en_US');
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
  }, [description, pathname, title, i18n.language]);

  return null;
}
