import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface BrandSignatureProps {
  className?: string;
}

/**
 * Versão 1 — Assinatura Editorial Minimalista (`</> DEV VIANA`)
 * Composição horizontal em SVG vetorial + tipografia editorial.
 * Colchetes `<` e `>` em `foreground`, barra `/` em `accent`,
 * `DEV` em `foreground` e `VIANA` em `accent`.
 */
export function BrandSignature({ className }: BrandSignatureProps) {
  return (
    <span className={cn('inline-flex select-none items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 44 28"
        className="h-5 w-auto shrink-0 sm:h-[1.35rem]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14.5 6.5L6 14L14.5 21.5"
          className="stroke-foreground"
          strokeWidth="3.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M29.5 6.5L38 14L29.5 21.5"
          className="stroke-foreground"
          strokeWidth="3.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M25.2 3.5L18.8 24.5"
          className="stroke-accent"
          strokeWidth="3.2"
          strokeLinecap="square"
        />
      </svg>
      <span className="font-display text-sm font-bold uppercase tracking-[0.14em] sm:text-[0.95rem]">
        <span className="text-foreground">DEV </span>
        <span className="text-accent">VIANA</span>
      </span>
    </span>
  );
}

interface BrandMonogramProps {
  className?: string;
  imgClassName?: string;
}

/**
 * Versão 2 — Monograma Institucional (`DV {/} DEV VIANA`)
 * Alterna automaticamente entre as versões com fundo transparente para modo claro e escuro.
 */
export function BrandMonogram({ className, imgClassName }: BrandMonogramProps) {
  const { theme } = useTheme();
  const src = theme === 'dark' ? '/brand/logo-dv-dark.png' : '/brand/logo-dv-light.png';

  return (
    <div className={cn('inline-flex items-center', className)}>
      <img
        src={src}
        alt="Dev Viana — Desenvolvendo Soluções"
        width={480}
        height={446}
        className={cn('h-auto w-full max-w-[13.5rem] select-none object-contain', imgClassName)}
      />
    </div>
  );
}

/**
 * Detalhe gráfico editorial da assinatura (`— ▪ —`) para o rodapé.
 */
export function BrandEditorialDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2.5', className)} aria-hidden="true">
      <span className="h-px w-12 bg-border sm:w-16" />
      <span className="h-1.5 w-1.5 bg-accent" />
      <span className="h-px w-12 bg-border sm:w-16" />
    </div>
  );
}
