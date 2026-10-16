import { RIBBON_REPEATS } from '../components/Ribbon';
import { flowRibbon, gsap, inkFill, MOTION, ScrollTrigger, useGSAP } from './gsap';

/**
 * Shell motion, mounted once after first paint and re-run per route: the header gains
 * its rule after the first screen and hides while scrolling down; the emblem turns with
 * scroll; the footer ribbon flows while it is on screen. Pages themselves
 * switch without any transition. Reduced motion: never mounted.
 */
export default function ShellMotion({ path }: { path: string }) {
  useGSAP(
    () => {
      const header = document.querySelector<HTMLElement>('.app-header');
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        if (header) {
          const hide = gsap.quickTo(header, 'yPercent', { duration: 0.5, ease: 'power3.out' });
          ScrollTrigger.create({
            start: 0,
            end: () => ScrollTrigger.maxScroll(window),
            onUpdate: (self) => {
              const y = self.scroll();
              header.classList.toggle('is-condensed', y > 80);
              const menuOpen = document.querySelector('dialog.menu[open]');
              hide(self.direction === 1 && y > window.innerHeight * 0.6 && !menuOpen ? -110 : 0);
            },
          });
          gsap.to('.brand-emblem svg', {
            rotation: 720,
            ease: 'none',
            scrollTrigger: { start: 0, end: () => ScrollTrigger.maxScroll(window), scrub: 0.8 },
          });
        }

        // Inner-page section titles ink in as they arrive. Only titles that start below
        // the fold: one already on screen would blink out and back.
        for (const title of gsap.utils.toArray<Element>('main.page [data-ink]'))
          if (title.getBoundingClientRect().top > window.innerHeight) inkFill(title);

        const ribbon = document.querySelector('.footer-ribbon');
        const flow = ribbon && flowRibbon(ribbon, RIBBON_REPEATS);
        if (ribbon && flow)
          ScrollTrigger.create({
            trigger: ribbon,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => (self.isActive ? flow.play() : flow.pause()),
          });
      });

      return () => {
        mm.revert();
        header?.classList.remove('is-condensed');
      };
    },
    { dependencies: [path], revertOnUpdate: true },
  );
  return null;
}
