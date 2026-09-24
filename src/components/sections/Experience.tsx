import { useTranslation } from 'react-i18next';
import { EDUCATION } from '@/data/education';
import { EXPERIENCE } from '@/data/experience';

export function Experience() {
  const { t } = useTranslation('pages');
  const role = EXPERIENCE[0];
  const degree = EDUCATION[0];
  const technical = EDUCATION[1];

  return (
    <section id="experience" className="section-container page-section" aria-labelledby="experience-title">
      <div className="relative rounded-2xl border border-border bg-background/95 px-6 py-10 shadow-sm backdrop-blur-md sm:px-12 sm:py-14">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {t('experience.eyebrow')}
        </p>
        <h1
          id="experience-title"
          className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          {t('experience.title')}
        </h1>
        <p className="mt-6 leading-7 text-muted-foreground">
          {t('experience.subtitle')}
        </p>
      </div>
      <ol className="relative mt-14 border-l border-border pl-7 sm:pl-12">
        <li className="relative border-b border-border pb-10">
          <span
            className="absolute -left-[2.05rem] top-1 h-3 w-3 rounded-full border-2 border-accent bg-background sm:-left-[3.35rem]"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            feat/full-stack-experience
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{t('experience.role.acsAutomacao')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {role.company} · {role.startDate} — {t('experience.current')}
          </p>
          <ul className="mt-5 max-w-3xl list-disc space-y-2 pl-5 leading-7 text-muted-foreground">
            <li>{t('experience.role.acsDesc1')}</li>
            <li>{t('experience.role.acsDesc2')}</li>
          </ul>
          <p className="mt-5 font-mono text-xs text-muted-foreground">
            {role.technologies?.join(' · ')}
          </p>
        </li>
        <li className="relative border-b border-border py-10">
          <span
            className="absolute -left-[2.05rem] top-11 h-3 w-3 rounded-full border-2 border-accent bg-background sm:-left-[3.35rem]"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            feat/software-engineering
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{t('experience.education.uniateneuField')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{degree.institution} · {t('experience.ongoing')}</p>
        </li>
        <li className="relative pt-10">
          <span
            className="absolute -left-[2.05rem] top-11 h-3 w-3 rounded-full border-2 border-accent bg-background sm:-left-[3.35rem]"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            chore/technical-foundation
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{t('experience.education.marwinField')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {technical.institution} · {technical.startDate}–{technical.endDate}
          </p>
        </li>
      </ol>
      </div>
    </section>
  );
}
