import { motion } from 'framer-motion';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Reveal } from '@/components/shared/Reveal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { SKILLS, SKILL_CATEGORIES } from '@/data/skills';

export function Skills() {
  return (
    <section id="skills" className="section-container" aria-label="Habilidades">
      <SectionTitle
        eyebrow="Skills"
        title="Tecnologias & Ferramentas"
        description="Um panorama das linguagens, frameworks e ferramentas que utilizo no dia a dia para construir aplicações completas."
      />

      <Tabs defaultValue="frontend" className="flex flex-col items-center">
        <TabsList>
          {SKILL_CATEGORIES.map((category) => (
            <TabsTrigger key={category.key} value={category.key}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SKILL_CATEGORIES.map((category) => (
          <TabsContent key={category.key} value={category.key} className="w-full">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SKILLS.filter((skill) => skill.category === category.key).map((skill, index) => (
                <Reveal key={skill.name} delay={index * 0.05} direction="up">
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="glass group flex flex-col gap-4 rounded-2xl p-5 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-2xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                        style={{ color: skill.color }}
                      >
                        <skill.icon />
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                    </div>
                    <Progress value={skill.level} />
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
