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
  branch: string;
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

const CELL_SIZE = 58;
const INFLUENCE_RADIUS = 250;
const MAX_WARP = 22;
const DOT_SPACING = 28;
const LERP_SPEED = 0.085;
const NODE_BASE_RADIUS = 1.4;
const NODE_ACTIVE_RADIUS = 3.0;
const REST_EPSILON = 0.25;

const PALETTES: Record<'light' | 'dark', GridPalette> = {
  light: {
    dot: 'rgba(21, 27, 30, 0.055)',
    lineBase: { r: 21, g: 27, b: 30, a: 0.055 },
    lineActive: { r: 19, g: 88, b: 110, a: 0.42 },
    nodeBase: { r: 21, g: 27, b: 30, a: 0.14 },
    nodeActive: { r: 19, g: 88, b: 110, a: 0.78 },
    glowRgb: '19, 88, 110',
    rippleRgb: '19, 88, 110',
    gitBase: { r: 19, g: 88, b: 110, a: 0.17 },
    gitActive: { r: 19, g: 88, b: 110, a: 0.72 },
    labelBase: { r: 21, g: 27, b: 30, a: 0.36 },
    labelActive: { r: 19, g: 88, b: 110, a: 0.92 },
    labelBg: 'rgba(244, 239, 231, 0.78)',
  },
  dark: {
    dot: 'rgba(244, 239, 231, 0.045)',
    lineBase: { r: 244, g: 239, b: 231, a: 0.055 },
    lineActive: { r: 78, g: 178, b: 201, a: 0.48 },
    nodeBase: { r: 244, g: 239, b: 231, a: 0.14 },
    nodeActive: { r: 78, g: 178, b: 201, a: 0.84 },
    glowRgb: '78, 178, 201',
    rippleRgb: '78, 178, 201',
    gitBase: { r: 78, g: 178, b: 201, a: 0.18 },
    gitActive: { r: 78, g: 178, b: 201, a: 0.78 },
    labelBase: { r: 244, g: 239, b: 231, a: 0.34 },
    labelActive: { r: 78, g: 178, b: 201, a: 0.94 },
    labelBg: 'rgba(21, 27, 30, 0.78)',
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
  tileCtx.beginPath();
  tileCtx.arc(DOT_SPACING / 2, DOT_SPACING / 2, 0.7, 0, Math.PI * 2);
  tileCtx.fill();
  return ctx.createPattern(tile, 'repeat');
}

function buildGitLayout(
  cols: number,
  rows: number,
  widthPx: number,
): {
  edges: GitEdge[];
  nodes: GitCommitNode[];
} {
  // Keep narrow mobile viewports uncluttered so hero and project typography stays crisp.
  if (widthPx < 768 || cols < 8 || rows < 6) {
    return { edges: [], nodes: [] };
  }

  const edges: GitEdge[] = [];
  const nodes: GitCommitNode[] = [];
  const showLabels = widthPx >= 1540;

  // Start at row 2 (below the 80px fixed navbar) in the outer lanes.
  const leftMain = 1;
  const leftFork = 2;
  const leftRows = [2, 4, 6, 8, 10, 12].filter((r) => r < rows - 1);

  for (let i = 0; i < leftRows.length; i++) {
    const r = leftRows[i];
    const forked = i === 1 || i === 2;
    const col = forked ? leftFork : leftMain;
    if (i > 0) {
      const prevRow = leftRows[i - 1];
      const prevCol = i - 1 === 1 || i - 1 === 2 ? leftFork : leftMain;
      edges.push({ fromCol: prevCol, fromRow: prevRow, toCol: col, toRow: r });
    }
    nodes.push({
      col,
      row: r,
      label: showLabels && i < LEFT_STACKS.length ? LEFT_STACKS[i] : '',
      branch: forked ? 'feat/backend' : 'feat/data-layer',
      isHead: i === 0,
      align: forked ? 'left' : 'right',
    });
  }

  const rightMain = cols - 2;
  const rightFork = cols - 3;
  if (rightFork > leftFork + 1) {
    const rightRows = [2, 4, 6, 8, 10, 12].filter((r) => r < rows - 1);
    for (let i = 0; i < rightRows.length; i++) {
      const r = rightRows[i];
      const forked = i === 2 || i === 3;
      const col = forked ? rightFork : rightMain;
      if (i > 0) {
        const prevRow = rightRows[i - 1];
        const prevCol = i - 1 === 2 || i - 1 === 3 ? rightFork : rightMain;
        edges.push({ fromCol: prevCol, fromRow: prevRow, toCol: col, toRow: r });
      }
      nodes.push({
        col,
        row: r,
        label: showLabels && i < RIGHT_STACKS.length ? RIGHT_STACKS[i] : '',
        branch: forked ? 'chore/tooling-qa' : 'feat/frontend',
        isHead: i === 0,
        align: forked ? 'right' : 'left',
      });
    }
  }

  return { edges, nodes };
}

function getWarpedPoint(
  gx: number,
  gy: number,
  col: number,
  row: number,
  mouse: Point,
  ripples: Ripple[],
  cols: number,
  rows: number,
  hasPointer: boolean,
): { pt: Point; proximity: number } {
  const edgeMargin = 1.5;
  const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
  const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
  const pinFactor = colPin * colPin * rowPin * rowPin;

  let proximity = 0;
  let rx = 0;
  let ry = 0;

  for (const r of ripples) {
    const rdx = gx - r.x;
    const rdy = gy - r.y;
    const rdist = Math.hypot(rdx, rdy);
    const waveWidth = 60;
    const diff = rdist - r.radius;
    if (Math.abs(diff) < waveWidth) {
      const waveFactor = (1 - Math.abs(diff) / waveWidth) * r.opacity;
      proximity = Math.max(proximity, waveFactor * 0.85 * pinFactor);
      const strength = waveFactor * 18 * pinFactor;
      const angle = Math.atan2(rdy, rdx);
      const sign = diff < 0 ? -1 : 1;
      rx += Math.cos(angle) * strength * sign * -1;
      ry += Math.sin(angle) * strength * sign * -1;
    }
  }

  if (hasPointer) {
    const dx = gx - mouse.x;
    const dy = gy - mouse.y;
    const dist = Math.hypot(dx, dy);
    proximity = Math.max(proximity, Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor);

    if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
      const t = dist / INFLUENCE_RADIUS;
      const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
      const warpAmt = eased * MAX_WARP * pinFactor;
      const angle = Math.atan2(dy, dx);
      return {
        pt: {
          x: gx - Math.cos(angle) * warpAmt + rx,
          y: gy - Math.sin(angle) * warpAmt + ry,
        },
        proximity,
      };
    }
  }

  return { pt: { x: gx + rx, y: gy + ry }, proximity };
}

export interface KineticGridProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Interactive kinetic grid fused with Git branch paths and portfolio stack nodes.
 * Sleeps at 0% CPU when resting (no pointer movement or active click ripples).
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
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });
  const gitLayoutRef = useRef<{
    cols: number;
    rows: number;
    edges: GitEdge[];
    nodes: GitCommitNode[];
  }>({ cols: 0, rows: 0, edges: [], nodes: [] });

  const drawFrame = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w: W, h: H, dpr } = sizeRef.current;
    if (W <= 0 || H <= 0) return;

    const palette = PALETTES[themeRef.current];
    const mouse = mouseRef.current;
    const ripples = ripplesRef.current;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Static background dot pattern (pre-rendered tile for O(1) fill)
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
      r.radius = Math.max(0, age * 420);
      r.opacity = Math.max(0, 1 - age * 1.25);
      if (r.opacity <= 0) ripples.splice(i, 1);
    }

    const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
    const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
    const cellW = W / (cols - 1);
    const cellH = H / (rows - 1);

    if (gitLayoutRef.current.cols !== cols || gitLayoutRef.current.rows !== rows) {
      const layout = buildGitLayout(cols, rows, W);
      gitLayoutRef.current = { cols, rows, ...layout };
    }

    const pts: Point[][] = [];
    const prox: number[][] = [];
    const hasPointer = hasPointerRef.current;

    for (let row = 0; row < rows; row++) {
      pts[row] = [];
      prox[row] = [];
      for (let col = 0; col < cols; col++) {
        const { pt, proximity } = getWarpedPoint(
          col * cellW,
          row * cellH,
          col,
          row,
          mouse,
          ripples,
          cols,
          rows,
          hasPointer,
        );
        pts[row][col] = pt;
        prox[row][col] = proximity;
      }
    }

    // 1. Batch all resting grid segments in a single path for mobile/desktop speed
    ctx.lineCap = 'butt';
    ctx.strokeStyle = colorString(palette.lineBase);
    ctx.lineWidth = 0.8;
    ctx.beginPath();

    const activeSegments: Array<{ p1: Point; p2: Point; t: number }> = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const pr1 = prox[row][col];
        const pr2 = prox[row][col + 1];
        if (pr1 > 0.01 || pr2 > 0.01) {
          const avg = (pr1 + pr2) / 2;
          activeSegments.push({
            p1: pts[row][col],
            p2: pts[row][col + 1],
            t: avg * avg * (3 - 2 * avg),
          });
        } else {
          ctx.moveTo(pts[row][col].x, pts[row][col].y);
          ctx.lineTo(pts[row][col + 1].x, pts[row][col + 1].y);
        }
      }
    }

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows - 1; row++) {
        const pr1 = prox[row][col];
        const pr2 = prox[row + 1][col];
        if (pr1 > 0.01 || pr2 > 0.01) {
          const avg = (pr1 + pr2) / 2;
          activeSegments.push({
            p1: pts[row][col],
            p2: pts[row + 1][col],
            t: avg * avg * (3 - 2 * avg),
          });
        } else {
          ctx.moveTo(pts[row][col].x, pts[row][col].y);
          ctx.lineTo(pts[row + 1][col].x, pts[row + 1][col].y);
        }
      }
    }
    ctx.stroke();

    // Draw only active energized segments individually
    for (const seg of activeSegments) {
      ctx.beginPath();
      ctx.moveTo(seg.p1.x, seg.p1.y);
      ctx.lineTo(seg.p2.x, seg.p2.y);
      ctx.strokeStyle = lerpColor(palette.lineBase, palette.lineActive, seg.t);
      ctx.lineWidth = lerpN(0.8, 1.45, seg.t);
      ctx.stroke();
    }

    // 2. Git branch tracks warped directly along grid coordinates
    const { edges, nodes } = gitLayoutRef.current;
    for (const edge of edges) {
      const p1 = pts[edge.fromRow]?.[edge.fromCol];
      const p2 = pts[edge.toRow]?.[edge.toCol];
      if (!p1 || !p2) continue;
      const pr = Math.max(
        prox[edge.fromRow]?.[edge.fromCol] ?? 0,
        prox[edge.toRow]?.[edge.toCol] ?? 0,
      );
      const t = pr * pr * (3 - 2 * pr);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = lerpColor(palette.gitBase, palette.gitActive, t);
      ctx.lineWidth = lerpN(1.2, 1.9, t);
      ctx.stroke();
    }

    // 3. Batch resting intersection dots; render active glow nodes individually
    ctx.fillStyle = colorString(palette.nodeBase);
    ctx.beginPath();
    const activeNodes: Array<{ p: Point; t: number }> = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const p = pts[row][col];
        const pr = prox[row][col];
        if (pr > 0.01) {
          activeNodes.push({ p, t: pr * pr * (3 - 2 * pr) });
        } else {
          ctx.moveTo(p.x + NODE_BASE_RADIUS, p.y);
          ctx.arc(p.x, p.y, NODE_BASE_RADIUS, 0, Math.PI * 2);
        }
      }
    }
    ctx.fill();

    for (const { p, t } of activeNodes) {
      const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);
      if (t > 0.3) {
        const glowR = r + lerpN(0, 6, (t - 0.3) / 0.7);
        const grd = ctx.createRadialGradient(p.x, p.y, r * 0.4, p.x, p.y, glowR);
        grd.addColorStop(0, `rgba(${palette.glowRgb},${(t * 0.28).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${palette.glowRgb},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = lerpColor(palette.nodeBase, palette.nodeActive, t);
      ctx.fill();
    }

    // 4. Git commit nodes + stack labels anchored to warped grid intersections
    if (nodes.length > 0) {
      ctx.font = '500 10.5px "IBM Plex Mono", ui-monospace, monospace';
      ctx.textBaseline = 'middle';

      for (const node of nodes) {
        const p = pts[node.row]?.[node.col];
        if (!p) continue;
        const pr = prox[node.row]?.[node.col] ?? 0;
        const t = pr * pr * (3 - 2 * pr);
        const radius = node.isHead ? lerpN(4.2, 5.6, t) : lerpN(3.0, 4.4, t);

        // Outer commit ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = lerpColor(palette.gitBase, palette.gitActive, t);
        ctx.lineWidth = node.isHead ? 1.5 : 1.1;
        ctx.stroke();

        // Commit center dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = lerpColor(palette.gitBase, palette.gitActive, t);
        ctx.fill();

        if (node.label) {
          const textWidth = ctx.measureText(node.label).width;
          const padX = 6;
          const boxH = 18;
          const boxW = textWidth + padX * 2;
          const offsetX = node.align === 'right' ? 12 : -(12 + boxW);
          const boxX = p.x + offsetX;
          const boxY = p.y - boxH / 2;

          ctx.fillStyle = palette.labelBg;
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxW, boxH, 4);
          ctx.fill();

          ctx.strokeStyle = lerpColor(palette.gitBase, palette.gitActive, t);
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.fillStyle = lerpColor(palette.labelBase, palette.labelActive, t);
          ctx.textAlign = 'left';
          ctx.fillText(node.label, boxX + padX, p.y + 0.5);
        }
      }
    }

    // 5. Click ripple rings
    for (const r of ripples) {
      const safeRadius = Math.max(0, r.radius);
      ctx.beginPath();
      ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${palette.rippleRgb},${(r.opacity * 0.25).toFixed(3)})`;
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
      const hasRipples = ripplesRef.current.length > 0;

      if (!pointerSettled || hasRipples) {
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
      const dpr = Math.min(window.devicePixelRatio || 1, coarsePointer.matches ? 1.5 : 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      sizeRef.current = { w, h, dpr };
      dotPatternRef.current.pattern = null;
      drawFrame(performance.now());
    };

    setSize();

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reducedMotion.matches) return;
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
      if (reducedMotion.matches) return;
      if (document.documentElement.dataset.openingIntro === 'playing') return;
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

  // Redraw immediately when theme flips so the canvas matches the live theme tokens.
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
