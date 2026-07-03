import { Code2, GraduationCap, Layers, Users, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  GraduationCap,
  Layers,
  Users,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
  const Icon = ICON_MAP[name] ?? Code2;
  return <Icon className={className} />;
}
