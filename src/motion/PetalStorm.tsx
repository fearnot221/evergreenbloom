import { useRef } from 'react';
import { PETAL } from '../components/motifs';
import { gsap, MOTION, ScrollTrigger, useGSAP } from './gsap';

type Petal = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  phase: number;
  size: number;
  tone: number;
};

/**
 * 櫻吹雪: a wind of flat petals across the hero, drawn on two canvases so near petals
 * pass in front of the wordmark and far ones behind it. On arrival the petals burst
 * from `origin` (櫻花爆開) and the wind takes them; pointer moves and scroll speed add
 * gusts. Runs on GSAP's ticker only while the hero is on screen; one still frame for
 * reduced motion.
 */
export function PetalStorm({ origin = [0.42, 0.62] }: { origin?: [number, number] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ reduce: '(prefers-reduced-motion: reduce)', motion: MOTION }, () => {
        const box = root.current;
        const back = box?.querySelector<HTMLCanvasElement>('.storm-back');
        const front = box?.querySelector<HTMLCanvasElement>('.storm-front');
        const bctx = back?.getContext('2d');
        const fctx = front?.getContext('2d');
        if (!box || !back || !front || !bctx || !fctx) return;

        const readTones = () => {
          const css = getComputedStyle(document.documentElement);
          return ['--storm-1', '--storm-2', '--storm-3'].map((v) => css.getPropertyValue(v));
        };
        let tones = readTones();
        const shape = new Path2D(PETAL);
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let w = 0;
        let h = 0;
        let petals: Petal[] = [];

        const seed = (burst: boolean): Petal[] =>
          Array.from({ length: w < 700 ? 44 : 100 }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = burst ? 4 + Math.random() * 14 : 0;
            const z = 0.25 + Math.random() * 0.75;
            return {
              x: burst ? w * origin[0] : Math.random() * w,
              y: burst ? h * origin[1] : Math.random() * h,
              z,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - (burst ? 3 : 0),
              rot: Math.random() * Math.PI * 2,
              spin: (Math.random() - 0.5) * 0.06,
              phase: Math.random() * Math.PI * 2,
              size: (0.18 + z * 0.42) * (w < 700 ? 0.8 : 1),
              tone: Math.floor(Math.random() * 3),
            };
          });

        const resize = () => {
          const dpr = Math.min(devicePixelRatio, 2);
          w = box.clientWidth;
          h = box.clientHeight;
          for (const c of [back, front]) {
            c.width = w * dpr;
            c.height = h * dpr;
            c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
        };

        const draw = (t: number) => {
          bctx.clearRect(0, 0, w, h);
          fctx.clearRect(0, 0, w, h);
          for (const p of petals) {
            const ctx = p.z > 0.86 ? fctx : bctx;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            // Tumbling: the petal turns edge-on and back as it falls.
            ctx.scale(p.size, p.size * (0.35 + 0.65 * Math.abs(Math.cos(t * 1.6 + p.phase))));
            ctx.globalAlpha = 0.55 + p.z * 0.45;
            ctx.fillStyle = tones[p.tone];
            ctx.fill(shape);
            ctx.restore();
          }
        };

        let last = 0;
        // Day and night use different petal tones: repaint when the scheme flips.
        const scheme = matchMedia('(prefers-color-scheme: dark)');
        const onScheme = () => {
          tones = readTones();
          draw(last);
        };
        scheme.addEventListener('change', onScheme);

        resize();
        petals = seed(!reduce);
        if (reduce) {
          draw(0);
          return () => scheme.removeEventListener('change', onScheme);
        }

        const wind = { x: 0.7, gust: 0 };
        const tick = (time: number, delta: number) => {
          const k = Math.min(delta / 16.7, 3);
          last = time;
          const flow = wind.x + wind.gust;
          for (const p of petals) {
            const targetX = flow * (0.4 + p.z) + Math.sin(time * 0.7 + p.phase) * 0.5;
            const targetY = 0.45 + p.z * 0.5 + Math.cos(time * 0.9 + p.phase) * 0.35;
            p.vx += (targetX - p.vx) * 0.018 * k;
            p.vy += (targetY - p.vy) * 0.018 * k;
            p.x += p.vx * k;
            p.y += p.vy * k;
            p.rot += (p.spin + p.vx * 0.004) * k;
            if (p.x > w + 40) p.x = -40;
            if (p.x < -60) p.x = w + 30;
            if (p.y > h + 40) {
              p.y = -40;
              p.x = Math.random() * w;
            }
          }
          wind.gust *= 0.97 ** k;
          draw(time);
        };

        const gust = (amount: number) => {
          wind.gust = Math.min(wind.gust + amount, 6);
        };
        const onPointer = (event: PointerEvent) => gust(Math.abs(event.movementX) * 0.015);
        box.parentElement?.addEventListener('pointermove', onPointer);
        const observer = new ResizeObserver(() => {
          const narrow = w < 700;
          resize();
          // Crossing the phone/desktop width changes how many petals the storm should have.
          if (narrow !== w < 700) petals = seed(false);
          draw(last);
        });
        observer.observe(box);

        let running = false;
        const run = (on: boolean) => {
          if (on === running) return;
          running = on;
          if (on) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        };
        const trigger = ScrollTrigger.create({
          trigger: box,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => run(self.isActive),
          onUpdate: (self) => gust(Math.abs(self.getVelocity()) / 2500),
        });
        run(trigger.isActive);

        return () => {
          run(false);
          scheme.removeEventListener('change', onScheme);
          observer.disconnect();
          box.parentElement?.removeEventListener('pointermove', onPointer);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="storm" aria-hidden="true">
      <canvas className="storm-back" />
      <canvas className="storm-front" />
    </div>
  );
}
