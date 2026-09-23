import { useEffect, useMemo, useState } from 'react';
import { GitBranch } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import {
  BRANCHES,
  STACK_COPY,
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
  const active = TECHNOLOGIES[activeIndex];
  const branch = BRANCHES.find((item) => item.id === active.branch)!;
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
  const paused = Boolean(reducedMotion || hovered || focused || hidden);
  const branchStart = 125 + activeBranchIndex * 250;

  return (
    <section
      id="skills"
      className="page-section border-y border-border bg-card/50"
      aria-labelledby="stack-title"
    >
      <div className="section-container">
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow">{STACK_COPY.eyebrow}</p>
          <h1 id="stack-title" className="page-title">
            {STACK_COPY.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {STACK_COPY.introduction}
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
          <div className="stack-main" aria-label={STACK_COPY.mainBranch}>
            <span className="stack-main-mark">
              <GitBranch size={16} aria-hidden="true" /> main
            </span>
            <strong>{STACK_COPY.mainTitle}</strong>
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

          <div className="stack-branches-list" role="group" aria-label={STACK_COPY.branchSelector}>
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
                  <span>{item.label}</span>
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
              aria-label={`${STACK_COPY.technologySelector}: ${branch.label}`}
            >
              <svg
                className="stack-orbit-cable"
                viewBox="0 0 1000 220"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M 145 92 C 280 92 350 112 500 104 C 650 96 720 116 855 116" />
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
                    aria-label={`Selecionar ${technology.name}`}
                    aria-pressed={isActive}
                  >
                    {isActive && <span className="head-label">● {STACK_COPY.head}</span>}
                    <span className="stack-node-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="stack-node-name">{technology.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="stack-active-copy" aria-live="polite">
              <p className="eyebrow">{active.branchLabel} → main</p>
              <h2>{active.name}</h2>
              <p>{branch.label}</p>
              <p className="stack-context">{active.context}</p>
            </div>

            <div
              className="stack-tech-list"
              role="group"
              aria-label={`${STACK_COPY.technologySelector}: ${branch.label}`}
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
