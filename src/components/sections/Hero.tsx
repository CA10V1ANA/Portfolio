import { ArrowDownRight, ArrowUpRight, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PERSONAL_INFO } from '@/lib/constants';
import { BrandMonogram } from '@/components/shared/BrandLogo';

export function Hero() {
  const { t } = useTranslation('pages');
  const { t: tc } = useTranslation('common');

  return (
    <section id="hero" className="portfolio-hero relative isolate border-b border-border">
      <div className="hero-grid mx-auto w-full max-w-7xl">
        <div className="hero-copy">
          <p className="eyebrow mb-7">{t('home.eyebrow')}</p>
          <h1 className="hero-title">
            Caio <span>Viana.</span>
          </h1>
          <p className="hero-description">{t('home.description')}</p>
          <div className="hero-actions">
            <Link to="/#projects" className="action-primary">
              {t('home.ctaProjects')} <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/projetos/js-boy" className="action-secondary">
              {t('home.ctaFeatured')} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <a className="hero-resume text-link" href={PERSONAL_INFO.resumeUrl} download>
            {tc('actions.downloadResume')} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>

        <div className="hero-identity">
          <div className="hero-identity-label" aria-hidden="true">
            <GitBranch size={14} /> dev/viana <span>→ main</span>
          </div>
          <div className="hero-monogram">
            <BrandMonogram />
          </div>
          <div className="hero-identity-stack" aria-hidden="true">
            <span>Java / Spring</span>
            <span>React / Angular</span>
          </div>
          <dl className="hero-facts">
            <div className="flex gap-4">
              <dt className="text-muted-foreground">{t('home.locationLabel')}</dt>
              <dd>{t('home.locationValue')}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-muted-foreground">{t('home.educationLabel')}</dt>
              <dd>{t('home.educationValue')}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="hero-bottom mx-auto max-w-7xl">
        <span>{t('home.discipline')}</span>
        <a href="#projects">
          {t('home.selectedWork')} <ArrowDownRight size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
