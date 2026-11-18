import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface Point {
  x: number;
  y: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  born: number;
}

interface GitCommitNode {
  col: number;
  row: number;
  label: string;
  labelWidth: number;
  isHead?: boolean;
  align: 'left' | 'right';
}

interface GitEdge {
  fromCol: number;
  fromRow: number;
  toCol: number;
  toRow: number;
}

interface GridPalette {
  dot: string;
  lineBase: { r: number; g: number; b: number; a: number };
  lineActive: { r: number; g: number; b: number; a: number };
  nodeBase: { r: number; g: number; b: number; a: number };
  nodeActive: { r: number; g: number; b: number; a: number };
  glowRgb: string;
  rippleRgb: string;
  gitBase: { r: number; g: number; b: number; a: number };
  gitActive: { r: number; g: number; b: number; a: number };
  labelBase: { r: number; g: number; b: number; a: number };
  labelActive: { r: number; g: number; b: number; a: number };
  labelBg: string;
}

const CELL_SIZE = 74;
const INFLUENCE_RADIUS = 230;
const MAX_WARP = 20;
const DOT_SPACING = 32;
const LERP_SPEED = 0.24;
const NODE_BASE_SIZE = 2.4;
const NODE_ACTIVE_RADIUS = 3.0;
const REST_EPSILON = 0.6;
const LABEL_FONT = '500 10.5px "IBM Plex Mono", ui-monospace, monospace';

const PALETTES: Record<'light' | 'dark', GridPalette> = {
  light: {
    dot: 'rgba(21, 27, 30, 0.05)',
    lineBase: { r: 21, g: 27, b: 30, a: 0.055 },
    lineActive: { r: 19, g: 88, b: 110, a: 0.44 },
    nodeBase: { r: 21, g: 27, b: 30, a: 0.14 },
    nodeActive: { r: 19, g: 88, b: 110, a: 0.8 },
    glowRgb: '19, 88, 110',
    rippleRgb: '19, 88, 110',
    gitBase: { r: 19, g: 88, b: 110, a: 0.17 },
    gitActive: { r: 19, g: 88, b: 110, a: 0.72 },
    labelBase: { r: 21, g: 27, b: 30, a: 0.36 },
    labelActive: { r: 19, g: 88, b: 110, a: 0.92 },
    labelBg: 'rgba(244, 239, 231, 0.8)',
  },
  dark: {
    dot: 'rgba(244, 239, 231, 0.045)',
    lineBase: { r: 244, g: 239, b: 231, a: 0.055 },
    lineActive: { r: 78, g: 178, b: 201, a: 0.48 },
    nodeBase: { r: 244, g: 239, b: 231, a: 0.14 },
    nodeActive: { r: 78, g: 178, b: 201, a: 0.85 },
    glowRgb: '78, 178, 201',
    rippleRgb: '78, 178, 201',
    gitBase: { r: 78, g: 178, b: 201, a: 0.18 },
    gitActive: { r: 78, g: 178, b: 201, a: 0.78 },
    labelBase: { r: 244, g: 239, b: 231, a: 0.34 },
    labelActive: { r: 78, g: 178, b: 201, a: 0.94 },
    labelBg: 'rgba(21, 27, 30, 0.8)',
  },
};

const LEFT_STACKS = ['Java 21', 'Spring Boot', 'Groovy / Grails', 'PostgreSQL', 'Oracle', 'Flyway'];
const RIGHT_STACKS = ['React', 'TypeScript', 'Vite', 'Zustand', 'Git', 'JUnit 5'];

function lerpN(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(
  base: { r: number; g: number; b: number; a: number },
  active: { r: number; g: number; b: number; a: number },
  t: number,
): string {
  const r = Math.round(lerpN(base.r, active.r, t));
  const g = Math.round(lerpN(base.g, active.g, t));
  const b = Math.round(lerpN(base.b, active.b, t));
  const a = lerpN(base.a, active.a, t);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function colorString(c: { r: number; g: number; b: number; a: number }): string {
  return `rgba(${c.r},${c.g},${c.b},${c.a.toFixed(3)})`;
}

function buildDotPattern(ctx: CanvasRenderingContext2D, dotColor: string): CanvasPattern | null {
  const tile = document.createElement('canvas');
  tile.width = DOT_SPACING;
  tile.height = DOT_SPACING;
  const tileCtx = tile.getContext('2d');
  if (!tileCtx) return null;
  tileCtx.fillStyle = dotColor;
  tileCtx.fillRect(DOT_SPACING / 2 - 0.6, DOT_SPACING / 2 - 0.6, 1.2, 1.2);
  return ctx.createPattern(tile, 'repeat');
}

function buildGitLayout(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  widthPx: number,
): {
  edges: GitEdge[];
  nodes: GitCommitNode[];
} {
  // Keep mobile viewports uncluttered so hero and project typography stays crisp.
  if (widthPx < 768 || cols < 7 || rows < 5) {
    return { edges: [], nodes: [] };
  }

  const edges: GitEdge[] = [];
  const nodes: GitCommitNode[] = [];
  const showLabels = widthPx >= 1540;
  ctx.font = LABEL_FONT;

  const leftMain = 1;
  const leftFork = 2;
  const leftRows = [2, 3, 5, 7, 9, 11].filter((r) => r < rows - 1);

  for (let i = 0; i < leftRows.length; i++) {
    const r = leftRows[i];
    const forked = i === 1 || i === 2;
    const col = forked ? leftFork : leftMain;
    if (i > 0) {
      const prevRow = leftRows[i - 1];
      const prevCol = i - 1 === 1 || i - 1 === 2 ? leftFork : leftMain;
      edges.push({ fromCol: prevCol, fromRow: prevRow, toCol: col, toRow: r });
    }
    const label = showLabels && i < LEFT_STACKS.length ? LEFT_STACKS[i] : '';
    nodes.push({
      col,
      row: r,
      label,
      labelWidth: label ? ctx.measureText(label).width : 0,
      isHead: i === 0,
      align: forked ? 'left' : 'right',
    });
  }

  const rightMain = cols - 2;
  const rightFork = cols - 3;
  if (rightFork > leftFork + 1) {
    const rightRows = [2, 3, 5, 7, 9, 11].filter((r) => r < rows - 1);
    for (let i = 0; i < rightRows.length; i++) {
      const r = rightRows[i];
      const forked = i === 2 || i === 3;
      const col = forked ? rightFork : rightMain;
      if (i > 0) {
        const prevRow = rightRows[i - 1];
        const prevCol = i - 1 === 2 || i - 1 === 3 ? rightFork : rightMain;
        edges.push({ fromCol: prevCol, fromRow: prevRow, toCol: col, toRow: r });
      }
      const label = showLabels && i < RIGHT_STACKS.length ? RIGHT_STACKS[i] : '';
      nodes.push({
        col,
        row: r,
        label,
        labelWidth: label ? ctx.measureText(label).width : 0,
        isHead: i === 0,
        align: forked ? 'right' : 'left',
      });
    }
  }

  return { edges, nodes };
}

export interface KineticGridProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Interactive kinetic grid fused with Git branch paths and portfolio stack nodes.
 * Uses flat pre-allocated buffers, 1x canvas backing store, and sleeps at 0% CPU at rest.
 */
export function KineticGrid({ children, className }: KineticGridProps) {
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotPatternRef = useRef<{ theme: 'light' | 'dark'; pattern: CanvasPattern | null }>({
    theme: 'light',
    pattern: null,
  });

  const mouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const targetMouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const hasPointerRef = useRef(false);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const buffersRef = useRef<{
    cols: number;
    rows: number;
    ptsX: Float32Array;
    ptsY: Float32Array;
    prox: Float32Array;
  }>({
    cols: 0,
    rows: 0,
    ptsX: new Float32Array(0),
    ptsY: new Float32Array(0),
    prox: new Float32Array(0),
  });
  const gitLayoutRef = useRef<{
    cols: number;
    rows: number;
    width: number;
    edges: GitEdge[];
    nodes: GitCommitNode[];
  }>({ cols: 0, rows: 0, width: 0, edges: [], nodes: [] });

  const drawFrame = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w: W, h: H } = sizeRef.current;
    if (W <= 0 || H <= 0) return;

    const palette = PALETTES[themeRef.current];
    const mouse = mouseRef.current;
    const ripples = ripplesRef.current;
    const hasPointer = hasPointerRef.current;

    ctx.clearRect(0, 0, W, H);

    // Pre-rendered micro-dot texture fill
    if (dotPatternRef.current.theme !== themeRef.current || !dotPatternRef.current.pattern) {
      dotPatternRef.current = {
        theme: themeRef.current,
        pattern: buildDotPattern(ctx, palette.dot),
      };
    }
    if (dotPatternRef.current.pattern) {
      ctx.fillStyle = dotPatternRef.current.pattern;
      ctx.fillRect(0, 0, W, H);
    }

    // Advance click ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      const age = (now - r.born) / 1000;
      r.radius = Math.max(0, age * 460);
      r.opacity = Math.max(0, 1 - age * 1.35);
      if (r.opacity <= 0) ripples.splice(i, 1);
    }

    const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
    const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
    const cellW = W / (cols - 1);
    const cellH = H / (rows - 1);
    const total = cols * rows;

    if (buffersRef.current.cols !== cols || buffersRef.current.rows !== rows) {
      buffersRef.current = {
        cols,
        rows,
        ptsX: new Float32Array(total),
        ptsY: new Float32Array(total),
        prox: new Float32Array(total),
      };
    }

    if (
      gitLayoutRef.current.cols !== cols ||
      gitLayoutRef.current.rows !== rows ||
      gitLayoutRef.current.width !== W
    ) {
      const layout = buildGitLayout(ctx, cols, rows, W);
      gitLayoutRef.current = { cols, rows, width: W, ...layout };
    }

    const { ptsX, ptsY, prox } = buffersRef.current;
    const hasRipples = ripples.length > 0;
    const edgeMargin = 1.5;

    for (let row = 0; row < rows; row++) {
      const gy = row * cellH;
      const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
      const rowPinSq = rowPin * rowPin;
      const rowOffset = row * cols;

      // Quick Y bounding-box check for pointer influence
      const nearMouseY = hasPointer && Math.abs(gy - mouse.y) < INFLUENCE_RADIUS;

      for (let col = 0; col < cols; col++) {
        const gx = col * cellW;
        const idx = rowOffset + col;

        if (!nearMouseY && !hasRipples) {
          ptsX[idx] = gx;
          ptsY[idx] = gy;
          prox[idx] = 0;
          continue;
        }

        const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
        const pinFactor = colPin * colPin * rowPinSq;

        if (pinFactor <= 0) {
          ptsX[idx] = gx;
          ptsY[idx] = gy;
          prox[idx] = 0;
          continue;
        }

        let proximity = 0;
        let rx = 0;
        let ry = 0;

        if (hasRipples) {
          for (let i = 0; i < ripples.length; i++) {
            const r = ripples[i];
            const waveWidth = 60;
            const maxR = r.radius + waveWidth;
            const rdx = gx - r.x;
            const rdy = gy - r.y;
            if (Math.abs(rdx) > maxR || Math.abs(rdy) > maxR) continue;
            const rdist = Math.hypot(rdx, rdy);
            const diff = rdist - r.radius;
            if (Math.abs(diff) < waveWidth) {
              const waveFactor = (1 - Math.abs(diff) / waveWidth) * r.opacity;
              proximity = Math.max(proximity, waveFactor * 0.85 * pinFactor);
              const strength = waveFactor * 18 * pinFactor;
              const inv = rdist > 0.001 ? 1 / rdist : 0;
              const sign = diff < 0 ? 1 : -1;
              rx += rdx * inv * strength * sign;
              ry += rdy * inv * strength * sign;
            }
          }
        }

        let px = gx + rx;
        let py = gy + ry;

        if (nearMouseY) {
          const dx = gx - mouse.x;
          if (Math.abs(dx) < INFLUENCE_RADIUS) {
            const dy = gy - mouse.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < INFLUENCE_RADIUS * INFLUENCE_RADIUS && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const p = (1 - dist / INFLUENCE_RADIUS) * pinFactor;
              if (p > proximity) proximity = p;
              const t = dist / INFLUENCE_RADIUS;
              const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
              const warpAmt = eased * MAX_WARP * pinFactor;
              const inv = 1 / dist;
              px -= dx * inv * warpAmt;
              py -= dy * inv * warpAmt;
            }
          }
        }

        ptsX[idx] = px;
        ptsY[idx] = py;
        prox[idx] = proximity;
      }
    }

    // 1. Batch all resting grid lines into a single stroke
    ctx.lineCap = 'butt';
    ctx.strokeStyle = colorString(palette.lineBase);
    ctx.lineWidth = 0.8;
    ctx.beginPath();

    const activeSegs: number[] = [];

    for (let row = 0; row < rows; row++) {
      const rowOffset = row * cols;
      for (let col = 0; col < cols - 1; col++) {
        const i1 = rowOffset + col;
        const i2 = i1 + 1;
        const pr1 = prox[i1];
        const pr2 = prox[i2];
        if (pr1 > 0.01 || pr2 > 0.01) {
          activeSegs.push(i1, i2);
        } else {
          ctx.moveTo(ptsX[i1], ptsY[i1]);
          ctx.lineTo(ptsX[i2], ptsY[i2]);
        }
      }
    }

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows - 1; row++) {
        const i1 = row * cols + col;
        const i2 = i1 + cols;
        const pr1 = prox[i1];
        const pr2 = prox[i2];
        if (pr1 > 0.01 || pr2 > 0.01) {
          activeSegs.push(i1, i2);
        } else {
          ctx.moveTo(ptsX[i1], ptsY[i1]);
          ctx.lineTo(ptsX[i2], ptsY[i2]);
        }
      }
    }
    ctx.stroke();

    for (let i = 0; i < activeSegs.length; i += 2) {
      const i1 = activeSegs[i];
      const i2 = activeSegs[i + 1];
      const avg = (prox[i1] + prox[i2]) * 0.5;
      const t = avg * avg * (3 - 2 * avg);
      ctx.beginPath();
      ctx.moveTo(ptsX[i1], ptsY[i1]);
      ctx.lineTo(ptsX[i2], ptsY[i2]);
      ctx.strokeStyle = lerpColor(palette.lineBase, palette.lineActive, t);
      ctx.lineWidth = lerpN(0.8, 1.45, t);
      ctx.stroke();
    }

    // 2. Git branch tracks warped along grid coordinates
    const { edges, nodes } = gitLayoutRef.current;
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const i1 = edge.fromRow * cols + edge.fromCol;
      const i2 = edge.toRow * cols + edge.toCol;
      const pr = Math.max(prox[i1] ?? 0, prox[i2] ?? 0);
      const t = pr * pr * (3 - 2 * pr);
      ctx.beginPath();
      ctx.moveTo(ptsX[i1], ptsY[i1]);
      ctx.lineTo(ptsX[i2], ptsY[i2]);
      ctx.strokeStyle = lerpColor(palette.gitBase, palette.gitActive, t);
      ctx.lineWidth = lerpN(1.2, 1.9, t);
      ctx.stroke();
    }

    // 3. Batch resting intersection squares (far faster than arc) + energized dots
    const halfDot = NODE_BASE_SIZE * 0.5;
    ctx.fillStyle = colorString(palette.nodeBase);
    ctx.beginPath();
    const activeNodeIdx: number[] = [];

    for (let idx = 0; idx < total; idx++) {
      const pr = prox[idx];
      if (pr > 0.01) {
        activeNodeIdx.push(idx);
      } else {
        ctx.rect(ptsX[idx] - halfDot, ptsY[idx] - halfDot, NODE_BASE_SIZE, NODE_BASE_SIZE);
      }
    }
    ctx.fill();

    for (let i = 0; i < activeNodeIdx.length; i++) {
      const idx = activeNodeIdx[i];
      const pr = prox[idx];
      const t = pr * pr * (3 - 2 * pr);
      const px = ptsX[idx];
      const py = ptsY[idx];
      const r = lerpN(1.2, NODE_ACTIVE_RADIUS, t);

      if (t > 0.3) {
        ctx.beginPath();
        ctx.arc(px, py, r + 4 * t, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.glowRgb},${(t * 0.14).toFixed(3)})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = lerpColor(palette.nodeBase, palette.nodeActive, t);
      ctx.fill();
    }

    // 4. Git commit nodes + outer-gutter stack labels
    if (nodes.length > 0) {
      ctx.font = LABEL_FONT;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const idx = node.row * cols + node.col;
        const px = ptsX[idx];
        const py = ptsY[idx];
        if (px === undefined || py === undefined) continue;

        const pr = prox[idx] ?? 0;
        const t = pr * pr * (3 - 2 * pr);
        const radius = node.isHead ? lerpN(4.2, 5.4, t) : lerpN(3.0, 4.2, t);

        ctx.beginPath();
        ctx.arc(px, py, radius + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = lerpColor(palette.gitBase, palette.gitActive, t);
        ctx.lineWidth = node.isHead ? 1.5 : 1.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = lerpColor(palette.gitBase, palette.gitActive, t);
        ctx.fill();

        if (node.label) {
          const padX = 6;
          const boxH = 18;
          const boxW = node.labelWidth + padX * 2;
          const offsetX = node.align === 'right' ? 12 : -(12 + boxW);
          const boxX = px + offsetX;
          const boxY = py - boxH / 2;

          ctx.fillStyle = palette.labelBg;
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxW, boxH, 4);
          ctx.fill();

          ctx.strokeStyle = lerpColor(palette.gitBase, palette.gitActive, t);
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.fillStyle = lerpColor(palette.labelBase, palette.labelActive, t);
          ctx.fillText(node.label, boxX + padX, py + 0.5);
        }
      }
    }

    // 5. Click ripple rings
    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      const safeRadius = Math.max(0, r.radius);
      ctx.beginPath();
      ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${palette.rippleRgb},${(r.opacity * 0.24).toFixed(3)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');

    const stopLoop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const step = (now: number) => {
      rafRef.current = 0;
      if (document.hidden || reducedMotion.matches) {
        drawFrame(now);
        return;
      }

      const m = mouseRef.current;
      const t = targetMouseRef.current;
      m.x = lerpN(m.x, t.x, LERP_SPEED);
      m.y = lerpN(m.y, t.y, LERP_SPEED);

      drawFrame(now);

      const pointerSettled =
        !hasPointerRef.current ||
        (Math.abs(t.x - m.x) < REST_EPSILON && Math.abs(t.y - m.y) < REST_EPSILON);

      if (!pointerSettled || ripplesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    const wakeLoop = () => {
      if (document.hidden) return;
      if (reducedMotion.matches) {
        drawFrame(performance.now());
        return;
      }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    const setSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // 1x backing store keeps fullscreen 2D canvas fill fast across high-DPI displays.
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
      sizeRef.current = { w, h };
      dotPatternRef.current.pattern = null;
      drawFrame(performance.now());
    };

    setSize();

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || coarsePointer.matches || reducedMotion.matches) return;
      if (!hasPointerRef.current) {
        hasPointerRef.current = true;
        mouseRef.current = { x: event.clientX, y: event.clientY };
      }
      targetMouseRef.current = { x: event.clientX, y: event.clientY };
      wakeLoop();
    };

    const onPointerLeave = () => {
      hasPointerRef.current = false;
      targetMouseRef.current = { x: -9999, y: -9999 };
      mouseRef.current = { x: -9999, y: -9999 };
      drawFrame(performance.now());
    };

    const onClick = (event: MouseEvent) => {
      if (coarsePointer.matches || reducedMotion.matches) return;
      if (document.documentElement.dataset.openingIntro === 'playing') return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('a, button, input, select, textarea')) return;

      ripplesRef.current.push({
        x: event.clientX,
        y: event.clientY,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
      wakeLoop();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
        ripplesRef.current = [];
      } else {
        drawFrame(performance.now());
      }
    };

    const onMotionChange = () => {
      if (reducedMotion.matches) {
        stopLoop();
        ripplesRef.current = [];
        hasPointerRef.current = false;
      }
      drawFrame(performance.now());
    };

    window.addEventListener('resize', setSize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('click', onClick, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', onMotionChange);

    return () => {
      stopLoop();
      window.removeEventListener('resize', setSize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', onMotionChange);
    };
  }, [drawFrame]);

  useEffect(() => {
    dotPatternRef.current.pattern = null;
    drawFrame(performance.now());
  }, [theme, drawFrame]);

  const canvasElement = (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 -z-10 h-full w-full', className)}
    />
  );

  if (children === undefined) {
    return canvasElement;
  }

  return (
    <>
      {canvasElement}
      {children}
    </>
  );
}

export default KineticGrid;
