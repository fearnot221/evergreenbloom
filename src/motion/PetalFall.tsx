import { useRef } from 'react';
import { Petal } from '../components/motifs';
import { gsap, MOTION, ScrollTrigger, useGSAP } from './gsap';

const FALL = 14;

/**
 * 往下滑之後櫻花瓣飄落: once the hero is scrolled past, petals drift down behind the
 * content; scrolling faster makes them fall faster, then they ease back to a drift.
 * Paused and hidden while the hero is in view. Reduced motion: nothing renders moving.
 */
export function PetalFall({ after }: { after: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const fall = gsap.timeline({ paused: true });
        for (const petal of gsap.utils.toArray<SVGElement>('.fall-petal')) {
          const drift = gsap.utils.random(-12, 12);
          fall.fromTo(
            petal,
            {
              x: () => `${gsap.utils.random(0, 96)}vw`,
              y: '-12vh',
              rotation: gsap.utils.random(0, 360),
              scale: gsap.utils.random(0.55, 1.1),
            },
            {
              y: '112vh',
              x: `+=${drift}vw`,
              rotation: `+=${gsap.utils.random(180, 420)}`,
              duration: gsap.utils.random(9, 15),
              ease: 'none',
              repeat: -1,
            },
            gsap.utils.random(-15, 0),
          );
        }
        gsap.set(root.current, { autoAlpha: 0 });
        ScrollTrigger.create({
          // Resolved on the document: a selector here would be scoped to the petal layer.
          trigger: document.querySelector(after),
          start: 'bottom 70%',
          endTrigger: document.documentElement,
          end: 'bottom bottom',
          onToggle: (self) => {
            gsap.to(root.current, { autoAlpha: self.isActive ? 1 : 0, duration: 0.6 });
            if (self.isActive) fall.play();
            else gsap.delayedCall(0.6, () => fall.pause());
          },
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 700, 3);
            fall.timeScale(Math.max(fall.timeScale(), boost));
            gsap.to(fall, { timeScale: 1, duration: 1.4, ease: 'power2.out', overwrite: true });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="petal-fall" aria-hidden="true">
      {Array.from({ length: FALL }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical decorative petals.
        <Petal key={i} className="fall-petal" />
      ))}
    </div>
  );
}
