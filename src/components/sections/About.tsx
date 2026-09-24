import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation('pages');

  return (
    <section id="about" className="section-container page-section" aria-labelledby="about-title">
      <div className="relative rounded-2xl border border-border bg-background/95 px-6 py-10 shadow-sm backdrop-blur-md sm:px-12 sm:py-14">
      <div className="grid min-h-[65svh] gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-20">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {t('about.eyebrow')}
          </p>
          <h1
            id="about-title"
            className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            {t('about.title')}
          </h1>
        </div>
        <div className="space-y-6 text-lg leading-8 text-muted-foreground">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
        </div>
      </div>
      </div>
    </section>
  );
}
