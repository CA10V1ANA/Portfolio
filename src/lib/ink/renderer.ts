import type { Theme } from '@/context/theme-context';
import type { ViewportSnapshot } from './capture';
import { createNoiseTexture } from './noiseTexture';
import { createInkProgram, type InkProgram } from './program';
import { FULLSCREEN_VERT, INK_BLEED_FRAG } from './shader';

export interface InkFrame {
  to: Theme;
  center: { x: number; y: number };
  progress: number;
  radius: number;
  cleanup: number;
  time: number;
  seed: { x: number; y: number; angle: number };
}

export const INK_PARAMS = {
  duration: 0.95,
  tendril: 1,
  noiseScale: 1,
  softness: 1.4,
  drift: 1,
} as const;

const RIM_COLORS: Record<Theme, [number, number, number]> = {
  dark: [0.0, 0.0, 0.01],
  light: [1.0, 0.996, 0.985],
};

/** Owns the WebGL2 overlay canvas, Ink Bleed program, noise texture, and "from" snapshot. */
export class InkRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly maxTextureSize: number;

  private gl: WebGL2RenderingContext;
  private program!: InkProgram;
  private vao!: WebGLVertexArrayObject;
  private noise!: WebGLTexture;
  private fromTexture: WebGLTexture | null = null;
  private fromMeta: {
    theme: Theme;
    width: number;
    height: number;
    scale: number;
    key: string;
  } | null = null;
  private canvasScale = 1;
  private lost = false;

  static create(canvas: HTMLCanvasElement): InkRenderer | null {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return null;

    try {
      return new InkRenderer(canvas, gl);
    } catch (error) {
      console.error('[ink] WebGL2 initialization failed:', error);
      return null;
    }
  }

  private constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.canvas = canvas;
    this.gl = gl;
    this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    this.init();
  }

  private init(): void {
    const gl = this.gl;
    this.program = createInkProgram(gl, FULLSCREEN_VERT, INK_BLEED_FRAG);
    const vao = gl.createVertexArray();
    if (!vao) throw new Error('createVertexArray failed');

    this.vao = vao;
    this.noise = createNoiseTexture(gl);
    gl.disable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  }

  watchContext(onLost: () => void, onRestored: () => void, signal: AbortSignal): void {
    this.canvas.addEventListener(
      'webglcontextlost',
      (event) => {
        event.preventDefault();
        this.lost = true;
        this.fromTexture = null;
        this.fromMeta = null;
        onLost();
      },
      { signal },
    );

    this.canvas.addEventListener(
      'webglcontextrestored',
      () => {
        this.lost = false;
        try {
          this.init();
          onRestored();
        } catch (error) {
          console.error('[ink] WebGL2 context restore failed:', error);
          this.lost = true;
          onLost();
        }
      },
      { signal },
    );
  }

  get isLost(): boolean {
    return this.lost;
  }

  invalidate(): void {
    if (this.fromMeta) {
      this.fromMeta.key = '';
    }
  }

  hasValid(theme: Theme, key: string): boolean {
    return !this.lost && this.fromMeta?.theme === theme && this.fromMeta.key === key;
  }

  resize(scale: number): void {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * scale));
    const height = Math.max(1, Math.round(rect.height * scale));
    if (this.canvas.width !== width) this.canvas.width = width;
    if (this.canvas.height !== height) this.canvas.height = height;
    this.canvasScale = rect.width > 0 ? width / rect.width : scale;
  }

  upload(snapshot: ViewportSnapshot): void {
    if (this.lost) return;
    const gl = this.gl;

    if (!this.fromTexture) {
      const texture = gl.createTexture();
      if (!texture) throw new Error('createTexture failed');
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.fromTexture = texture;
    } else {
      gl.bindTexture(gl.TEXTURE_2D, this.fromTexture);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, snapshot.canvas);
    this.fromMeta = {
      theme: snapshot.theme,
      width: snapshot.canvas.width,
      height: snapshot.canvas.height,
      scale: snapshot.scale,
      key: snapshot.key,
    };
  }

  draw(frame: InkFrame): boolean {
    if (this.lost || !this.fromTexture || !this.fromMeta) return false;

    const gl = this.gl;
    const { program, uniform } = this.program;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(program);
    gl.bindVertexArray(this.vao);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fromTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.noise);

    gl.uniform1i(uniform('uFrom'), 0);
    gl.uniform1i(uniform('uNoise'), 1);
    gl.uniform2f(uniform('uFromSize'), this.fromMeta.width, this.fromMeta.height);
    gl.uniform1f(uniform('uFromRatio'), this.fromMeta.scale / this.canvasScale);
    gl.uniform1f(uniform('uCanvasScale'), this.canvasScale);
    gl.uniform2f(uniform('uRes'), this.canvas.width, this.canvas.height);

    gl.uniform2f(uniform('uCenter'), frame.center.x, frame.center.y);
    gl.uniform1f(uniform('uRadius'), frame.radius);
    gl.uniform1f(uniform('uCleanup'), frame.cleanup);
    gl.uniform1f(uniform('uTime'), frame.time);
    gl.uniform1f(
      uniform('uRef'),
      Math.max(this.canvas.width, this.canvas.height) / this.canvasScale,
    );
    gl.uniform2f(uniform('uSeed'), frame.seed.x, frame.seed.y);

    const cos = Math.cos(frame.seed.angle);
    const sin = Math.sin(frame.seed.angle);
    gl.uniformMatrix2fv(uniform('uSeedRot'), false, [cos, sin, -sin, cos]);

    gl.uniform1f(uniform('uTendril'), INK_PARAMS.tendril);
    gl.uniform1f(uniform('uNoiseScale'), INK_PARAMS.noiseScale);
    gl.uniform1f(uniform('uSoftness'), INK_PARAMS.softness);
    gl.uniform1f(uniform('uDrift'), INK_PARAMS.drift);
    gl.uniform3fv(uniform('uRimColor'), RIM_COLORS[frame.to]);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return true;
  }

  dispose(): void {
    if (!this.lost) {
      const gl = this.gl;
      gl.deleteProgram(this.program.program);
      if (this.fromTexture) gl.deleteTexture(this.fromTexture);
      gl.deleteTexture(this.noise);
      gl.deleteVertexArray(this.vao);
    }
    this.fromTexture = null;
    this.fromMeta = null;
    this.lost = true;
  }
}
