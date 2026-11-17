import { useEffect, useState, type CSSProperties } from 'react';
import {
  SiAngular,
  SiDocker,
  SiGit,
  SiOpenjdk,
  SiPostgresql,
  SiReact,
  SiSpringboot,
  SiTypescript,
} from 'react-icons/si';

const DURATION_MS = 2250;

const INTRO_STACK = [
  { name: 'Java', Icon: SiOpenjdk, x: -150, y: -90, rotation: -6 },
  { name: 'Spring Boot', Icon: SiSpringboot, x: 0, y: -142, rotation: 0 },
  { name: 'PostgreSQL', Icon: SiPostgresql, x: 150, y: -90, rotation: 6 },
  { name: 'Angular', Icon: SiAngular, x: -178, y: 22, rotation: -4 },
  { name: 'React', Icon: SiReact, x: 178, y: 22, rotation: 4 },
  { name: 'TypeScript', Icon: SiTypescript, x: -140, y: 132, rotation: -5 },
  { name: 'Docker', Icon: SiDocker, x: 0, y: 166, rotation: 0 },
  { name: 'Git', Icon: SiGit, x: 140, y: 132, rotation: 5 },
];

function shouldShowIntro() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function OpeningIntro() {
  const [visible, setVisible] = useState(shouldShowIntro);

  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    root.dataset.openingIntro = 'playing';
    const dismiss = () => setVisible(false);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreferenceChange = () => {
      if (media.matches) dismiss();
    };
    const timeout = window.setTimeout(dismiss, DURATION_MS);
    window.addEventListener('keydown', dismiss, { once: true });
    window.addEventListener('pointerdown', dismiss, { once: true });
    media.addEventListener('change', onPreferenceChange);
    return () => {
      delete root.dataset.openingIntro;
      window.clearTimeout(timeout);
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('pointerdown', dismiss);
      media.removeEventListener('change', onPreferenceChange);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="opening-intro" aria-hidden="true">
      <div className="opening-panel opening-panel-left" />
      <div className="opening-panel opening-panel-right" />
      <div className="opening-brand">
        <span className="opening-code-line">
          <span>const</span> developer = {'{'} fullStack: <span>true</span> {'}'};
        </span>
        <div className="opening-scene">
          <span className="opening-code-orbit opening-code-orbit-one">{'{ }'}</span>
          <span className="opening-code-orbit opening-code-orbit-two">{'( )'}</span>
          {INTRO_STACK.map(({ name, Icon, x, y, rotation }, index) => (
            <div className="opening-tech-anchor" key={name}>
              <span
                className="opening-tech"
                style={
                  {
                    '--code-x': x,
                    '--code-y': y,
                    '--code-rotation': `${rotation}deg`,
                    '--code-delay': `${index * 35}ms`,
                  } as CSSProperties
                }
              >
                <Icon aria-hidden="true" />
                <span>{name}</span>
              </span>
            </div>
          ))}
          <div className="opening-core">
            <svg className="opening-symbol" viewBox="0 0 160 96" fill="none">
              <g className="opening-bracket opening-bracket-left">
                <path pathLength="1" d="M49 23L23 48L49 73" />
              </g>
              <g className="opening-slash">
                <path pathLength="1" d="M94 12L66 84" />
              </g>
              <g className="opening-bracket opening-bracket-right">
                <path pathLength="1" d="M111 23L137 48L111 73" />
              </g>
            </svg>
          </div>
        </div>
        <span className="opening-signature">
          {'<'} DEV <span>VIANA</span> {'/>'}
        </span>
      </div>
    </div>
  );
}
