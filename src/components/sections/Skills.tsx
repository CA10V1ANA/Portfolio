import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, GitBranch } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { BRANCHES, TECHNOLOGIES } from '@/data/technologies';

export function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualUntil, setManualUntil] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const reducedMotion = useReducedMotion();
  const active = TECHNOLOGIES[activeIndex];
  const branch = BRANCHES.find((item) => item.id === active.branch)!;
  const branchItems = TECHNOLOGIES.filter((item) => item.branch === active.branch);
  const branchIndex = branchItems.findIndex((item) => item.id === active.id);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (reducedMotion || hovered || focused || hidden) return;
    const delay = Math.max(4000, manualUntil - Date.now());
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % TECHNOLOGIES.length), delay);
    return () => window.clearTimeout(timer);
  }, [activeIndex, focused, hidden, hovered, manualUntil, reducedMotion]);

  function select(index: number) {
    setActiveIndex(index);
    setManualUntil(Date.now() + 7000);
  }
  function selectBranch(branchId: string) {
    const first = TECHNOLOGIES.findIndex((technology) => technology.branch === branchId);
    if (first >= 0) select(first);
  }

  return (
    <section id="skills" className="page-section border-y border-border bg-card/50" aria-labelledby="stack-title">
      <div className="section-container">
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow">04 / Ecossistema técnico</p>
          <h1 id="stack-title" className="page-title">Stack Branch Orbit</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Tecnologias organizadas por camada. Cada branch parte da integração Full Stack e retorna à main.</p>
        </div>

        <div className="stack-board" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
          <div className="stack-main" aria-label="Branch principal: main, integração Full Stack">
            <span className="stack-main-mark"><GitBranch size={16} aria-hidden="true" /> main</span>
            <strong>Full Stack Integration</strong>
            <span className="stack-merge" aria-hidden="true">merge</span>
          </div>
          <svg className="stack-branches" viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
            <path d="M500 0 C500 55 125 30 125 145" />
            <path d="M500 0 C500 70 375 55 375 145" />
            <path d="M500 0 C500 70 625 55 625 145" />
            <path d="M500 0 C500 55 875 30 875 145" />
          </svg>
          <div className="stack-branches-list" role="group" aria-label="Selecionar branch técnica">
            {BRANCHES.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active.branch;
              return <button key={item.id} type="button" onClick={() => selectBranch(item.id)} aria-pressed={isActive} className={`stack-branch${isActive ? ' is-active' : ''}`}><Icon size={15} aria-hidden="true" /><span>{item.label}</span><code>{item.gitLabel}</code></button>;
            })}
          </div>
          <div className="stack-mobile-tracks" role="group" aria-label="Trilhas de tecnologias">
            {BRANCHES.map((item) => <div className="stack-mobile-track" key={item.id}>
              <button type="button" onClick={() => selectBranch(item.id)} aria-pressed={item.id === active.branch}>{item.label}</button>
              <div>{TECHNOLOGIES.filter((technology) => technology.branch === item.id).map((technology) => <button key={technology.id} type="button" onClick={() => select(TECHNOLOGIES.findIndex((entry) => entry.id === technology.id))} aria-pressed={technology.id === active.id}>{technology.name}</button>)}</div>
            </div>)}
          </div>

          <div className="stack-detail">
            <div className="stack-neighbors" aria-label="Tecnologias vizinhas nesta branch">
              <button type="button" className="stack-neighbor" onClick={() => branchIndex > 0 && select(TECHNOLOGIES.findIndex((item) => item.id === branchItems[branchIndex - 1].id))} disabled={branchIndex <= 0}>
                <span>{branchItems[branchIndex - 1]?.name ?? '—'}</span><small>Anterior</small>
              </button>
              <span className="head-label"><span aria-hidden="true">●</span> HEAD</span>
              <button type="button" className="stack-neighbor" onClick={() => branchIndex < branchItems.length - 1 && select(TECHNOLOGIES.findIndex((item) => item.id === branchItems[branchIndex + 1].id))} disabled={branchIndex >= branchItems.length - 1}>
                <span>{branchItems[branchIndex + 1]?.name ?? '—'}</span><small>Próxima</small>
              </button>
            </div>
            <div className="stack-active" key={active.id}>
              <span className="stack-active-icon"><active.icon size={34} aria-hidden="true" /></span>
              <p className="eyebrow">{active.branchLabel} → main</p>
              <h2>{active.name}</h2>
              <p className="text-muted-foreground">{branch.label}</p>
              <p className="stack-context">{active.context}</p>
            </div>
            <div className="stack-tech-list" role="group" aria-label={`Tecnologias de ${branch.label}`}>
              {branchItems.map((technology) => <button type="button" key={technology.id} onClick={() => select(TECHNOLOGIES.findIndex((item) => item.id === technology.id))} aria-pressed={technology.id === active.id} className="tech-chip">{technology.name}</button>)}
            </div>
            <div className="stack-controls">
              <button type="button" onClick={() => select((activeIndex - 1 + TECHNOLOGIES.length) % TECHNOLOGIES.length)} aria-label="Tecnologia anterior"><ArrowLeft size={17} aria-hidden="true" /> Anterior</button>
              <span>{String(activeIndex + 1).padStart(2, '0')} / {String(TECHNOLOGIES.length).padStart(2, '0')}</span>
              <button type="button" onClick={() => select((activeIndex + 1) % TECHNOLOGIES.length)} aria-label="Próxima tecnologia">Próxima <ArrowRight size={17} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
