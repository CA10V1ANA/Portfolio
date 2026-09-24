import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ENABLE_GIT_ECOSYSTEM_BACKGROUND } from '@/lib/constants';

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  type: 'commit' | 'hash' | 'binary' | 'branch' | 'tech';
  text: string;
  color: string;
  size: number;
  connections: Node[];
}

const COLORS = {
  purple: 'rgba(139, 92, 246, 0.6)', // Frontend / Base
  blue: 'rgba(59, 130, 246, 0.6)',   // Backend
  green: 'rgba(16, 185, 129, 0.6)',  // Data
  muted: 'rgba(107, 114, 128, 0.4)', // Hashes, binaries
};

const TECH_LABELS = [
  { text: 'React', color: COLORS.purple },
  { text: 'Angular', color: COLORS.purple },
  { text: 'TypeScript', color: COLORS.purple },
  { text: 'Java', color: COLORS.blue },
  { text: 'Spring', color: COLORS.blue },
  { text: 'PostgreSQL', color: COLORS.green },
  { text: 'Docker', color: COLORS.muted },
  { text: 'Git', color: COLORS.muted },
];

const BRANCH_NAMES = ['feat/frontend', 'feat/backend', 'data-layer', 'main'];

function randomHash() {
  return Math.random().toString(16).substring(2, 9);
}

function randomBinary() {
  const b = () => Math.random() > 0.5 ? '1' : '0';
  return `${b()}${b()}${b()}${b()} ${b()}${b()}${b()}${b()}`;
}

export function GitEcosystemBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const targetOpacityRef = useRef(0);
  const currentOpacityRef = useRef(0);

  // Determine target opacity based on route
  useEffect(() => {
    let opacity = 0.15; // default low
    const path = location.pathname;
    
    if (path.startsWith('/projetos')) opacity = 0.15;
    else if (path.startsWith('/stack')) opacity = 0.22;
    else if (path.startsWith('/sobre')) opacity = 0.08;
    else if (path.startsWith('/experiencia')) opacity = 0.12;
    else if (path.startsWith('/contato')) opacity = 0.05;
    else if (path === '/') opacity = 0.15;

    targetOpacityRef.current = opacity;
  }, [location.pathname]);

  useEffect(() => {
    if (!ENABLE_GIT_ECOSYSTEM_BACKGROUND) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let isPaused = document.hidden;
    
    // Set up canvas sizing
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      initNodes();
    };

    const initNodes = () => {
      const isMobile = window.innerWidth < 768;
      const nodeCount = isMobile ? Math.floor(Math.random() * 10) + 10 : Math.floor(Math.random() * 20) + 25; // 10-20 mobile, 25-45 desktop
      nodes = [];

      for (let i = 0; i < nodeCount; i++) {
        const typeRand = Math.random();
        let type: Node['type'] = 'commit';
        let text = '';
        let color = COLORS.purple;
        let size = 2;

        if (typeRand < 0.3) {
          type = 'commit';
          size = Math.random() * 2 + 2;
        } else if (typeRand < 0.5) {
          type = 'hash';
          text = randomHash();
          color = COLORS.muted;
        } else if (typeRand < 0.7) {
          type = 'binary';
          text = randomBinary();
          color = COLORS.muted;
        } else if (typeRand < 0.85) {
          type = 'branch';
          text = BRANCH_NAMES[Math.floor(Math.random() * BRANCH_NAMES.length)];
          color = COLORS.purple;
        } else {
          type = 'tech';
          const tech = TECH_LABELS[Math.floor(Math.random() * TECH_LABELS.length)];
          text = tech.text;
          color = tech.color;
        }

        nodes.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          baseX: 0,
          baseY: 0,
          vx: (Math.random() - 0.5) * 0.2, // Very slow natural drift
          vy: (Math.random() - 0.5) * 0.2,
          type,
          text,
          color,
          size,
          connections: [],
        });
      }

      // Initialize baseX/Y after generating
      nodes.forEach(n => {
        n.baseX = n.x;
        n.baseY = n.y;
      });

      // Create sparse connections (graph structure)
      nodes.forEach(node => {
        // Connect to 1-2 nearest nodes to form branches
        const neighbors = [...nodes]
          .filter(n => n !== node)
          .sort((a, b) => {
            const da = Math.hypot(a.x - node.x, a.y - node.y);
            const db = Math.hypot(b.x - node.x, b.y - node.y);
            return da - db;
          })
          .slice(0, Math.floor(Math.random() * 2) + 1);
        
        node.connections = neighbors;
      });
    };

    const update = () => {
      if (isPaused) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      
      ctx.clearRect(0, 0, width, height);

      // Smooth opacity transition
      const diff = targetOpacityRef.current - currentOpacityRef.current;
      currentOpacityRef.current += diff * 0.05;

      ctx.globalAlpha = currentOpacityRef.current;

      const mouseRadius = width < 768 ? 0 : 140; // no interaction on mobile
      const maxDisplacement = 30;

      // Update positions
      nodes.forEach(node => {
        if (!reducedMotion) {
          // Natural drift
          node.baseX += node.vx;
          node.baseY += node.vy;

          // Wrap around edges slowly
          if (node.baseX < -50) node.baseX = width + 50;
          if (node.baseX > width + 50) node.baseX = -50;
          if (node.baseY < -50) node.baseY = height + 50;
          if (node.baseY > height + 50) node.baseY = -50;

          // Mouse repulsion
          let dx = mouseRef.current.x - node.baseX;
          let dy = mouseRef.current.y - node.baseY;
          let distance = Math.hypot(dx, dy);

          let targetX = node.baseX;
          let targetY = node.baseY;

          if (distance < mouseRadius && distance > 0) {
            // Push away
            const force = (mouseRadius - distance) / mouseRadius;
            const pushX = (dx / distance) * force * maxDisplacement;
            const pushY = (dy / distance) * force * maxDisplacement;
            targetX = node.baseX - pushX;
            targetY = node.baseY - pushY;
          }

          // Ease towards target
          node.x += (targetX - node.x) * 0.1;
          node.y += (targetY - node.y) * 0.1;
        } else {
          // Static if reduced motion
          node.x = node.baseX;
          node.y = node.baseY;
        }
      });

      // Draw connections
      ctx.lineWidth = 1;
      nodes.forEach(node => {
        node.connections.forEach(target => {
          const dist = Math.hypot(target.x - node.x, target.y - node.y);
          if (dist < 250) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            // Curving lines
            const cpX = (node.x + target.x) / 2 + (target.y - node.y) * 0.1;
            const cpY = (node.y + target.y) / 2 + (target.x - node.x) * 0.1;
            ctx.quadraticCurveTo(cpX, cpY, target.x, target.y);
            
            // Fade out long connections
            const alpha = Math.max(0, 1 - dist / 250) * 0.5;
            ctx.strokeStyle = node.color.replace(/[\d.]+\)$/g, `${alpha})`);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        if (node.type === 'commit') {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();
        } else {
          ctx.font = node.type === 'branch' ? 'bold 11px monospace' : '10px monospace';
          ctx.fillStyle = node.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.text, node.x, node.y);
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleVisibility = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        // Resume
        animationFrameId = requestAnimationFrame(update);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    resize();
    if (!isPaused) update();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  if (!ENABLE_GIT_ECOSYSTEM_BACKGROUND) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
