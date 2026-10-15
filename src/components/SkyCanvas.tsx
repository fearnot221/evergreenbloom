import { useEffect, useRef } from 'react';
import { fragmentShader, vertexShader } from './sky-shader';

/**
 * Shader colours mirror the --sky-*, --cloud and --motif-petal* tokens in tokens.css
 * (WebGL cannot read OKLCH custom properties). Keep them in step.
 */
const palettes = {
  light: {
    uHigh: [0.69, 0.74, 0.95],
    uMid: [0.84, 0.79, 0.93],
    uLow: [0.97, 0.87, 0.91],
    uCloud: [0.99, 0.94, 0.96],
    uPetal: [1.0, 0.93, 0.95],
    uPetalDeep: [0.93, 0.62, 0.74],
  },
  dark: {
    uHigh: [0.11, 0.12, 0.25],
    uMid: [0.19, 0.15, 0.3],
    uLow: [0.3, 0.17, 0.3],
    uCloud: [0.4, 0.28, 0.42],
    uPetal: [0.98, 0.84, 0.9],
    uPetalDeep: [0.85, 0.5, 0.66],
  },
} as const;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('compile');
  return shader;
}

/**
 * The living spring sky behind the home page. Renders at reduced resolution, runs
 * only while an element matching `watch` is on screen and the tab is visible, eases
 * toward the pointer on mouse devices, and draws one still frame for reduced motion.
 * Without WebGL2 the CSS gradient on .sky-canvas remains.
 */
export function SkyCanvas({ watch = '.sky-window' }: { watch?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext('webgl2', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });
    if (!canvas || !gl) return;
    let program: WebGLProgram;
    try {
      program = gl.createProgram() as WebGLProgram;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    canvas.dataset.ready = 'true';
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook.
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u('uRes');
    const uTime = u('uTime');
    const uPointer = u('uPointer');

    const dark = matchMedia('(prefers-color-scheme: dark)');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const applyPalette = () => {
      const palette = dark.matches ? palettes.dark : palettes.light;
      for (const [name, value] of Object.entries(palette)) gl.uniform3fv(u(name), value);
    };
    applyPalette();

    // The sky is soft; half resolution (capped) keeps the fragment cost low.
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, 2) * 0.5;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const move = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = 1 - (event.clientY / window.innerHeight) * 2;
    };

    let frame = 0;
    let last = 0;
    let visible = true;
    const start = performance.now() - 14000;
    const minDelta = fine.matches ? 0 : 1000 / 30;
    const draw = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || reduce.matches) return;
      if (now - last >= minDelta) {
        last = now;
        draw(now);
      }
      frame = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (reduce.matches) {
        draw(start + 14000);
        return;
      }
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const watched = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) watched.add(entry.target);
        else watched.delete(entry.target);
      }
      visible = watched.size > 0;
      kick();
    });
    for (const el of document.querySelectorAll(watch)) io.observe(el);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce.matches || !frame) draw(performance.now());
    });
    ro.observe(canvas);
    const schemeChange = () => {
      applyPalette();
      draw(performance.now());
    };
    dark.addEventListener('change', schemeChange);
    reduce.addEventListener('change', kick);
    document.addEventListener('visibilitychange', kick);
    if (fine.matches) window.addEventListener('pointermove', move, { passive: true });
    draw(performance.now());
    kick();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      dark.removeEventListener('change', schemeChange);
      reduce.removeEventListener('change', kick);
      document.removeEventListener('visibilitychange', kick);
      window.removeEventListener('pointermove', move);
      // Free GPU objects but keep the context: a remount (StrictMode, back navigation)
      // receives the same context from getContext and must still be able to draw.
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [watch]);

  // biome-ignore lint/a11y/noAriaHiddenOnFocusable: the canvas is not focusable; it is decoration.
  return <canvas ref={ref} className="sky-canvas" aria-hidden="true" />;
}
