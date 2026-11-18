import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { PROJECT_I18N_MAP } from '@/data/projects';
import type { Project } from '@/types';

// Add screenshots to src/data/projects.ts to replace these typographic covers.
export function ProjectVisual({ project }: { project: Project }) {
  const { t } = useTranslation('projects');
  const [failedSrc, setFailedSrc] = useState<string>();
  const screenshot = project.screenshots?.[0];
  const key = PROJECT_I18N_MAP[project.id] ?? project.id;

  if (screenshot && screenshot.src !== failedSrc) {
    return (
      <div className="project-cover has-image">
        <img
          src={screenshot.src}
          alt={screenshot.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(screenshot.src)}
        />
      </div>
    );
  }

  return (
    <div className={`project-cover project-cover-${project.id}`} aria-hidden="true">
      <div className="cover-top">
        <span>{project.technologies[0]}</span>
        <ArrowUpRight size={18} />
      </div>
      <svg className="cover-branches" viewBox="0 0 600 350" fill="none">
        <path d="M-30 265H160C245 265 210 100 300 100H650M-30 265H650M300 100C390 100 360 265 450 265" />
        <circle cx="160" cy="265" r="7" />
        <circle cx="300" cy="100" r="7" />
        <circle cx="450" cy="265" r="7" />
      </svg>
      <div className="cover-name">
        <strong>{project.title}</strong>
        <span>{t(`${key}.subtitle`)}</span>
      </div>
      <span className="cover-bottom">{project.technologies.slice(0, 3).join(' / ')}</span>
    </div>
  );
}
