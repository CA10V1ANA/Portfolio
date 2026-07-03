import { motion } from 'framer-motion';
import { ArrowDown, Download, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { AuroraBackground } from '@/components/shared/AuroraBackground';
import { TypewriterText } from '@/components/shared/TypewriterText';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/lib/constants';

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6"
      aria-label="Hero"
    >
      <AuroraBackground />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center"
      >
        <motion.div variants={item}>
          <Avatar className="h-36 w-36 border-2 border-white/10 shadow-2xl shadow-primary/20 sm:h-44 sm:w-44">
            <AvatarImage src={PERSONAL_INFO.avatarUrl} alt={PERSONAL_INFO.name} />
            <AvatarFallback className="text-4xl">CV</AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.span
          variants={item}
          className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
        >
          Disponível para novas oportunidades
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Olá, eu sou{' '}
          <span className="text-gradient">{PERSONAL_INFO.name.split(' ')[0]} Viana</span>
        </motion.h1>

        <motion.div
          variants={item}
          className="h-9 font-display text-xl font-medium text-muted-foreground sm:text-2xl"
        >
          <TypewriterText words={PERSONAL_INFO.roles} />
        </motion.div>

        <motion.p
          variants={item}
          className="max-w-2xl text-balance text-muted-foreground sm:text-lg"
        >
          Construo aplicações web modernas, do backend com Java e Spring Boot ao frontend com React
          e Angular — sempre em busca de código limpo e experiências de usuário memoráveis.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <Button size="lg" asChild>
              <a href={PERSONAL_INFO.resumeUrl} download>
                <Download className="h-4 w-4" />
                Download CV
              </a>
            </Button>
          </MagneticButton>

          <MagneticButton>
            <Button size="lg" variant="outline" asChild>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
                <FaGithub className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </MagneticButton>

          <MagneticButton>
            <Button size="lg" variant="outline" asChild>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          </MagneticButton>

          <MagneticButton>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <Mail className="h-4 w-4" />
              Contato
            </Button>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ArrowDown className="h-4 w-4" />
      </motion.button>
    </section>
  );
}
