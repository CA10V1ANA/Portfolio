import { useCallback, useEffect, useRef, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { PROJECT_PATH } from '@/lib/constants';
import { ProjectVisual } from './ProjectVisual';
import type { Project } from '@/types';

export function ProjectCoverLink({ project, label }: { project: Project; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const frame = useRef<number | undefined>(undefined);
  const enabled = useRef(false);

  const reset = useCallback(() => {
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    ref.current?.style.removeProperty('--cover-rotate-x');
    ref.current?.style.removeProperty('--cover-rotate-y');
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => {
      enabled.current = !motion.matches && pointer.matches;
      if (!enabled.current) reset();
    };
    update();
    motion.addEventListener('change', update);
    pointer.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      pointer.removeEventListener('change', update);
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    };
  }, [reset]);

  function tilt(event: PointerEvent<HTMLAnchorElement>) {
    if (!enabled.current || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty('--cover-rotate-x', `${-y * 2.5}deg`);
      ref.current?.style.setProperty('--cover-rotate-y', `${x * 3}deg`);
    });
  }

  return (
    <Link
      ref={ref}
      to={PROJECT_PATH(project)}
      className="project-cover-link"
      aria-label={label}
      onPointerMove={tilt}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={reset}
    >
      <ProjectVisual project={project} />
    </Link>
  );
}
