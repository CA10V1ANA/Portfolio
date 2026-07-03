import { SectionTitle } from '@/components/shared/SectionTitle';
import { Reveal } from '@/components/shared/Reveal';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { PROJECTS } from '@/data/projects';

export function Projects() {
  return (
    <section id="projects" className="section-container" aria-label="Projetos">
      <SectionTitle
        eyebrow="Projetos"
        title="Projetos em Destaque"
        description="Uma seleção de projetos que desenvolvi aplicando Java, Spring Boot, React e outras tecnologias modernas."
      />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.08} className="group h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
