import { motion } from 'framer-motion';

export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:64px_64px] opacity-[0.15]" />

      <motion.div
        className="absolute -left-1/4 top-0 h-[36rem] w-[36rem] rounded-full bg-primary/30 blur-[120px]"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 40, 80, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 top-1/4 h-[30rem] w-[30rem] rounded-full bg-secondary/25 blur-[120px]"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 60, -30, 0],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-accent/25 blur-[120px]"
        animate={{
          x: [0, 50, -60, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
