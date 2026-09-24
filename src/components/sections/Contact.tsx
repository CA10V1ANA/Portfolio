import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

export function Contact() {
  const { t } = useTranslation('pages');
  const { t: tc } = useTranslation('common');

  return (
    <section
      id="contact"
      className="section-container page-section"
      aria-labelledby="contact-title"
    >
      <div className="relative rounded-2xl border border-border bg-background/95 px-6 py-10 shadow-sm backdrop-blur-md sm:px-12 sm:py-14 min-h-[65svh]">
      <p className="eyebrow">{t('contact.eyebrow')}</p>
      <h1
        id="contact-title"
        className="max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl"
      >
        {t('contact.title')}
      </h1>
      <p className="mt-7 max-w-xl text-lg leading-7 text-muted-foreground">
        {t('contact.description')}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={PERSONAL_INFO.resumeUrl}
          download
          className="inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-secondary"
        >
          {tc('actions.downloadResume')} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-secondary"
        >
          LinkedIn <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold hover:border-accent hover:text-accent"
        >
          GitHub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      </div>
    </section>
  );
}
