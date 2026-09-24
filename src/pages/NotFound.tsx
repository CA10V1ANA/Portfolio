import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function NotFound() {
  const { t } = useTranslation('common');

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="text-gradient font-display text-7xl font-bold sm:text-8xl">404</span>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t('error.notFoundTitle')}</h1>
      <p className="max-w-md text-muted-foreground">
        {t('error.notFoundDescription')}
      </p>
      <Button asChild size="lg">
        <Link to="/">
          <HomeIcon className="h-4 w-4" />
          {t('error.backHome')}
        </Link>
      </Button>
    </section>
  );
}
