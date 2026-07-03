import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
  delay?: number;
  duration?: number;
  once?: boolean;
}

const directionOffset: Record<NonNullable<RevealProps['direction']>, Variants> = {
  up: { hidden: { opacity: 0, y: 48 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -48 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -48 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.25 }}
      variants={directionOffset[direction]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
