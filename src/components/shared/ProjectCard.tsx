import { useState } from 'react';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { TiltCard } from './TiltCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <TiltCard className="h-full">
      <Card className="glow-border flex h-full flex-col overflow-hidden border-white/10">
        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
          {!imageError ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FolderGit2 className="h-14 w-14 text-primary/40" />
            </div>
          )}
          {project.featured && (
            <Badge className="absolute right-3 top-3" variant="default">
              Destaque
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
        </div>

        <CardContent className="flex flex-1 flex-col gap-4 p-6">
          <h3 className="font-display text-xl font-semibold">{project.title}</h3>
          <p className="flex-1 text-sm text-muted-foreground">{project.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-2 flex gap-3">
            {project.githubUrl && (
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <FaGithub className="h-4 w-4" />
                  Código
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button size="sm" className="flex-1" asChild>
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Demo
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}
