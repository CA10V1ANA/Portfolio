import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ENABLE_GIT_ECOSYSTEM_BACKGROUND } from '@/lib/constants';
import { SiAngular, SiReact, SiTypescript, SiOpenjdk, SiSpringboot, SiPostgresql, SiDocker, SiGit } from 'react-icons/si';

interface Node {
  id: string;
  x: number;
  y: number;
  baseX: number;
  vx: number;
  vy: number;
  side?: 'left' | 'right';
  type: 'branch' | 'tech';
  text: string;
  color: string;
  size: number;
  IconComponent?: React.ElementType;
  domElement?: HTMLElement | null;
}

const COLORS = {
  purple: 'rgba(139, 92, 246, 1)', // Frontend / Base
  blue: 'rgba(59, 130, 246, 1)',   // Backend
  green: 'rgba(16, 185, 129, 1)',  // Data
  muted: 'rgba(107, 114, 128, 0.8)', // Hashes, binaries
};

const TECH_ICONS = [
  { Icon: SiReact, color: COLORS.purple, name: 'React' },
  { Icon: SiAngular, color: COLORS.purple, name: 'Angular' },
  { Icon: SiTypescript, color: COLORS.purple, name: 'TypeScript' },
  { Icon: SiOpenjdk, color: COLORS.blue, name: 'Java' },
  { Icon: SiSpringboot, color: COLORS.blue, name: 'Spring' },
  { Icon: SiPostgresql, color: COLORS.green, name: 'PostgreSQL' },
  { Icon: SiDocker, color: COLORS.muted, name: 'Docker' },
  { Icon: SiGit, color: COLORS.muted, name: 'Git' },
];

const BRANCH_NAMES = ['feat/frontend', 'feat/backend', 'data-layer', 'main'];

export function GitEcosystemBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const targetOpacityRef = useRef(0);
  const currentOpacityRef = useRef(0);
  
  // State to hold tech nodes for React to render the SVG icons
  const [techNodes, setTechNodes] = useState<Node[]>([]);
  // We need to keep a mutable reference to all nodes for the animation loop
  const nodesRef = useRef<Node[]>([]);

  // Determine target opacity based on route (increased visibility)
  useEffect(() => {
    let opacity = 0.15; // default
    const path = location.pathname;
    
    if (path.startsWith('/projetos')) opacity = 0.15; // baixa
    else if (path.startsWith('/stack')) opacity = 0.22; // média
    else if (path.startsWith('/sobre')) opacity = 0.10; // muito baixa
    else if (path.startsWith('/experiencia')) opacity = 0.15; // baixa
    else if (path.startsWith('/contato')) opacity = 0.08; // mínima
    else if (path === '/') opacity = 0.15; // baixa

    targetOpacityRef.current = opacity;
  }, [location.pathname]);

  useEffect(() => {
    if (!ENABLE_GIT_ECOSYSTEM_BACKGROUND) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
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
      const nodeCount = isMobile ? Math.floor(Math.random() * 11) + 10 : Math.floor(Math.random() * 21) + 25; // 10-20 mobile, 25-45 desktop
      const newNodes: Node[] = [];

      for (let i = 0; i < nodeCount; i++) {
        const typeRand = Math.random();
        let type: Node['type'] = 'branch';
        let text = '';
        let color = COLORS.purple;
        let size = 3;
        let IconComponent: React.ElementType | undefined;

        if (typeRand < 0.5) {
          type = 'branch';
          text = BRANCH_NAMES[Math.floor(Math.random() * BRANCH_NAMES.length)];
          color = COLORS.purple;
        } else {
          type = 'tech';
          const tech = TECH_ICONS[Math.floor(Math.random() * TECH_ICONS.length)];
          text = tech.name;
          color = tech.color;
          IconComponent = tech.Icon;
        }

        const side = Math.random() > 0.5 ? 'left' : 'right';
        const margin = window.innerWidth < 768 ? window.innerWidth * 0.15 : window.innerWidth * 0.25;
        const startX = side === 'left' ? Math.random() * margin : window.innerWidth - (Math.random() * margin);

        newNodes.push({
          id: `node-${i}-${Date.now()}`,
          x: startX,
          y: Math.random() * window.innerHeight,
          baseX: 0,
          baseY: 0,
          vx: (Math.random() - 0.5) * 0.3, // slightly faster
          vy: (Math.random() - 0.5) * 0.3,
          side,
          type,
          text,
          color,
          size,
          IconComponent,
        });
      }

      // Initialize baseX/Y after generating
      newNodes.forEach(n => {
        n.baseX = n.x;
        n.baseY = n.y;
      });

      nodesRef.current = newNodes;
      setTechNodes(newNodes.filter(n => n.type === 'tech'));
    };

    const update = () => {
      if (isPaused) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const nodes = nodesRef.current;
      
      ctx.clearRect(0, 0, width, height);

      // Smooth opacity transition
      const diff = targetOpacityRef.current - currentOpacityRef.current;
      currentOpacityRef.current += diff * 0.05;

      ctx.globalAlpha = currentOpacityRef.current;

      const mouseRadius = width < 768 ? 0 : 160; 
      const maxDisplacement = 30;

      // Update positions
      nodes.forEach(node => {
        if (!reducedMotion) {
          // Natural drift
          node.baseX += node.vx;
          node.baseY += node.vy;

          const margin = width < 768 ? width * 0.15 : width * 0.25;

          // Wrap around edges slowly, respecting their side
          if (node.side === 'left') {
            if (node.baseX < -50) node.baseX = margin;
            if (node.baseX > margin) node.baseX = -50;
          } else {
            if (node.baseX < width - margin) node.baseX = width + 50;
            if (node.baseX > width + 50) node.baseX = width - margin;
          }

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
        
        // Update DOM element if it exists (tech icons)
        if (node.type === 'tech' && node.domElement) {
          // Center the icon by offsetting by -12px (assuming 24x24 icon)
          node.domElement.style.transform = `translate3d(${node.x - 12}px, ${node.y - 12}px, 0)`;
          node.domElement.style.opacity = currentOpacityRef.current.toString();
        }
      });



      // Draw nodes (except tech icons which are DOM elements)
      nodes.forEach(node => {
        if (node.type !== 'tech') {
          ctx.font = 'bold 13px monospace';
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

  const isBlurredPage = ['/sobre', '/projetos', '/stack', '/experiencia', '/contato'].some(p => location.pathname.startsWith(p));

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 -z-10 pointer-events-none transition-all duration-700 ${isBlurredPage ? 'blur-[4px]' : ''}`}
        aria-hidden="true"
      />
      <div className={`fixed inset-0 -z-10 pointer-events-none overflow-hidden transition-all duration-700 ${isBlurredPage ? 'blur-[4px]' : ''}`} aria-hidden="true">
        {techNodes.map(node => {
          const Icon = node.IconComponent;
          if (!Icon) return null;
          return (
            <div
              key={node.id}
              ref={el => { node.domElement = el; }}
              className="absolute left-0 top-0 will-change-transform drop-shadow-md"
              style={{ color: node.color, opacity: 0 }}
            >
              <Icon size={28} />
            </div>
          );
        })}
      </div>
    </>
  );
}
