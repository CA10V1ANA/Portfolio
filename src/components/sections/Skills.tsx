import { useEffect, useMemo, useState } from 'react';
import { GitBranch } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BRANCHES,
  TECHNOLOGIES,
  type PortfolioTechnology,
  type StackBranch,
} from '@/data/technologies';
import { cn } from '@/lib/utils';

const technologyIndex = (technology: PortfolioTechnology) =>
  TECHNOLOGIES.findIndex((item) => item.id === technology.id);

export function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualUntil, setManualUntil] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation('stack');
  const { t: tc } = useTranslation('common');
  const active = TECHNOLOGIES[activeIndex];
  const activeBranch = BRANCHES.find((item) => item.id === active.branch)!;
  const activeBranchIndex = BRANCHES.findIndex((item) => item.id === active.branch);
  const branchItems = useMemo(
    () => TECHNOLOGIES.filter((item) => item.branch === active.branch),
    [active.branch],
  );
  const branchIndex = branchItems.findIndex((item) => item.id === active.id);
  const previous = branchItems[(branchIndex - 1 + branchItems.length) % branchItems.length];
  const next = branchItems[(branchIndex + 1) % branchItems.length];

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (reducedMotion || hovered || focused || hidden) return;
    const delay = Math.max(6000, manualUntil - Date.now());
    const timer = window.setTimeout(() => setActiveIndex(technologyIndex(next)), delay);
    return () => window.clearTimeout(timer);
  }, [activeIndex, focused, hidden, hovered, manualUntil, next, reducedMotion]);

  function select(index: number) {
    setActiveIndex(index);
    setManualUntil(Date.now() + 7000);
  }

  function selectBranch(branchId: StackBranch) {
    const first = TECHNOLOGIES.findIndex((technology) => technology.branch === branchId);
    if (first >= 0) select(first);
  }

  const orbitNodes = [previous, active, next];
  const paused = Boolean(reducedMotion || hidden);
  const branchStart = 125 + activeBranchIndex * 250;
  const branchLabel = t(`branches.${active.branch}`);

  return (
    <section
      id="skills"
      className="page-section border-y border-border bg-card/50"
      aria-labelledby="stack-title"
    >
      <div className="section-container">
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 id="stack-title" className="page-title">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {t('introduction')}
          </p>
        </div>

        <div
          className={cn('stack-board', paused && 'is-paused')}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null))
              setFocused(false);
          }}
        >
          <div className="stack-main" aria-label={t('mainBranch')}>
            <span className="stack-main-mark">
              <GitBranch size={16} aria-hidden="true" /> main
            </span>
            <strong>{t('mainTitle')}</strong>
            <span className="stack-merge" aria-hidden="true">
              merge
            </span>
          </div>

          <svg
            className="stack-branches"
            viewBox="0 0 1000 150"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M500 0 C500 55 125 30 125 145" />
            <path d="M500 0 C500 70 375 55 375 145" />
            <path d="M500 0 C500 70 625 55 625 145" />
            <path d="M500 0 C500 55 875 30 875 145" />
          </svg>

          <div className="stack-branches-list" role="group" aria-label={t('branchSelector')}>
            {BRANCHES.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active.branch;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectBranch(item.id)}
                  aria-pressed={isActive}
                  className={cn('stack-branch', isActive && 'is-active')}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{t(`branches.${item.id}`)}</span>
                  <code>{item.gitLabel}</code>
                </button>
              );
            })}
          </div>

          <svg
            className="stack-orbit-bridge"
            viewBox="0 0 1000 72"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={`M ${branchStart} 0 C ${branchStart} 42 500 20 500 72`} />
          </svg>

          <div className="stack-detail">
            <div
              className="stack-orbit"
              key={`${active.branch}-${active.id}`}
              role="group"
              aria-label={`${t('technologySelector')}: ${branchLabel}`}
            >
              <svg
                className="stack-orbit-cable"
                viewBox="0 0 1000 220"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M 145 104 C 280 104 350 104 500 104 C 650 104 720 104 855 104" />
              </svg>
              {orbitNodes.map((technology, position) => {
                const Icon = technology.icon;
                const isActive = position === 1;
                return (
                  <button
                    key={`${position}-${technology.id}`}
                    type="button"
                    className={cn('stack-node', isActive && 'is-head')}
                    onClick={() => select(technologyIndex(technology))}
                    aria-label={tc('a11y.selectTech', { name: technology.name })}
                    aria-pressed={isActive}
                  >
                    {isActive && <span className="head-label">● {t('head')}</span>}
                    <span className="stack-node-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="stack-node-name">{technology.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="stack-active-copy" aria-live="polite">
              <p className="eyebrow">{activeBranch.gitLabel} → main</p>
              <h2>{active.name}</h2>
              <p>{branchLabel}</p>
              <p className="stack-context">{t(`tech.${active.id}`)}</p>
            </div>

            <div
              className="stack-tech-list"
              role="group"
              aria-label={`${t('technologySelector')}: ${branchLabel}`}
            >
              {branchItems.map((technology) => (
                <button
                  type="button"
                  key={technology.id}
                  onClick={() => select(technologyIndex(technology))}
                  aria-pressed={technology.id === active.id}
                  className="tech-chip"
                >
                  {technology.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
