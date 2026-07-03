import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/shared/AuroraBackground';

export function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <AuroraBackground />
      <span className="text-gradient font-display text-7xl font-bold sm:text-8xl">404</span>
      <h1 className="font-display text-2xl font-semibold sm:text-3xl">Página não encontrada</h1>
      <p className="max-w-md text-muted-foreground">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button asChild size="lg">
        <Link to="/">
          <HomeIcon className="h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>
    </section>
  );
}
