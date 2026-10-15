import { type RefObject, useEffect } from 'react';

/**
 * Writes a smoothed pointer offset (-1..1) to --px / --py on the element so motif
 * layers can drift at their own depth. Mouse/trackpad only, never for reduced
 * motion, paused while the element is off-screen. Purely decorative.
 */
export function usePointerDepth(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;
    let target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;
    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      el.style.setProperty('--px', current.x.toFixed(3));
      el.style.setProperty('--py', current.y.toFixed(3));
      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled || !visible ? 0 : requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      target = {
        x: ((event.clientX - box.left) / box.width) * 2 - 1,
        y: ((event.clientY - box.top) / box.height) * 2 - 1,
      };
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };
    const leave = () => {
      target = { x: 0, y: 0 };
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      el.style.removeProperty('--px');
      el.style.removeProperty('--py');
    };
  }, [ref]);
}
