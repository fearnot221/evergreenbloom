import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { HeadlineSwap } from '../src/components/HeadlineSwap';
import { gsap } from '../src/motion/gsap';
import { PetalStorm } from '../src/motion/PetalStorm';

type Context = { add: (name: string, callback: () => void) => void; swap?: () => void };
const motion = vi.hoisted(() => ({
  setup: () => {},
  media: {
    conditions: {} as unknown,
    run: (_context: Context): (() => void) | undefined => undefined,
  },
  loop: { call: vi.fn(), paused: vi.fn() },
  ticker: { add: vi.fn(), remove: vi.fn() },
  lines: [{ inert: false }, { inert: false }],
  trigger: { isActive: true },
  toggle: (_self: { isActive: boolean }) => {},
}));

vi.mock('react', async (original) => ({
  ...(await original<typeof import('react')>()),
  useRef: (current: unknown) => ({ current }),
  useState: (initial: unknown) => [initial, vi.fn()],
}));

vi.mock('../src/motion/gsap', () => ({
  MOTION: '(prefers-reduced-motion: no-preference)',
  useGSAP: (setup: () => void) => {
    motion.setup = setup;
  },
  gsap: {
    matchMedia: () => ({
      add: (conditions: unknown, run: typeof motion.media.run) => {
        motion.media = { conditions, run };
      },
      revert() {},
    }),
    utils: { toArray: () => motion.lines },
    set: vi.fn(),
    to() {},
    fromTo() {},
    timeline: () => motion.loop,
    ticker: motion.ticker,
  },
  ScrollTrigger: {
    create: ({ onToggle }: { onToggle: typeof motion.toggle }) => {
      motion.toggle = onToggle;
      return motion.trigger;
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  motion.loop.call.mockReturnValue(motion.loop);
});
afterEach(() => vi.unstubAllGlobals());

it('keeps ticker rotation stopped for focus, hover, manual pause and an offscreen ticker', () => {
  const ticker = HeadlineSwap({
    items: [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ],
  });
  motion.setup();
  const context: Context = {
    add(name, callback) {
      if (name === 'swap') this.swap = callback;
    },
  };
  const cleanup = motion.media.run(context);
  expect(motion.loop.paused).toHaveBeenLastCalledWith(false);
  ticker.props.onFocus();
  expect(motion.loop.paused).toHaveBeenLastCalledWith(true);
  ticker.props.onBlur({ currentTarget: { contains: () => true }, relatedTarget: {} });
  expect(motion.loop.paused).toHaveBeenLastCalledWith(true);
  ticker.props.onBlur({ currentTarget: { contains: () => false }, relatedTarget: null });
  expect(motion.loop.paused).toHaveBeenLastCalledWith(false);
  ticker.props.onPointerEnter();
  expect(motion.loop.paused).toHaveBeenLastCalledWith(true);
  ticker.props.onPointerLeave();
  expect(motion.loop.paused).toHaveBeenLastCalledWith(false);
  motion.toggle({ isActive: false });
  expect(motion.loop.paused).toHaveBeenLastCalledWith(true);
  motion.toggle({ isActive: true });
  const button = ticker.props.children[2];
  button.props.onClick();
  ticker.props.onPointerEnter();
  ticker.props.onPointerLeave();
  expect(motion.loop.paused).toHaveBeenLastCalledWith(true);
  cleanup?.();
  expect(motion.lines.every((line) => !line.inert)).toBe(true);
});

it('clears animated headline styles when returning to the static reduced-motion view', () => {
  HeadlineSwap({
    items: [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ],
  });
  motion.setup();
  const context: Context = {
    add(name, callback) {
      if (name === 'swap') this.swap = callback;
    },
  };
  const cleanup = motion.media.run(context);
  context.swap?.();
  cleanup?.();
  expect(gsap.set).toHaveBeenLastCalledWith(motion.lines, {
    clearProps: 'transform,opacity,visibility',
  });
  expect(motion.lines.every((line) => !line.inert)).toBe(true);
});

it('removes the storm drawing callback before rebuilding a still frame for reduced motion', () => {
  let reduced = false;
  const scheme = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
  vi.stubGlobal('matchMedia', (query: string) => ({
    ...scheme,
    matches: query.includes('reduced-motion') && reduced,
  }));
  vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: () => 'pink' }));
  vi.stubGlobal('document', { documentElement: {} });
  vi.stubGlobal('Path2D', class {});
  vi.stubGlobal('devicePixelRatio', 1);
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect = disconnect;
    },
  );
  const draw = vi.fn();
  const ctx = {
    clearRect: draw,
    setTransform() {},
    save() {},
    translate() {},
    rotate() {},
    scale() {},
    fill() {},
    restore() {},
  };
  const canvas = { getContext: () => ctx };
  const parent = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
  const storm = PetalStorm({});
  storm.props.ref.current = {
    querySelector: () => canvas,
    clientWidth: 1000,
    clientHeight: 700,
    parentElement: parent,
  };
  motion.setup();
  expect(motion.media.conditions).toEqual({
    reduce: '(prefers-reduced-motion: reduce)',
    motion: '(prefers-reduced-motion: no-preference)',
  });
  const context: Context = { add() {} };
  const cleanup = motion.media.run(context);
  const tick = motion.ticker.add.mock.calls[0][0];
  cleanup?.();
  expect(motion.ticker.remove).toHaveBeenCalledWith(tick);
  expect(disconnect).toHaveBeenCalled();
  expect(parent.removeEventListener).toHaveBeenCalled();
  reduced = true;
  vi.clearAllMocks();
  const stillCleanup = motion.media.run(context);
  expect(draw).toHaveBeenCalled();
  expect(motion.ticker.add).not.toHaveBeenCalled();
  stillCleanup?.();
  expect(scheme.removeEventListener).toHaveBeenCalled();
});
