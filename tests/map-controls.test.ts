import fs from 'node:fs';
import { afterEach, expect, it, vi } from 'vitest';
import type { CampusDataset } from '../src/geo/types';
import { mountCampus } from '../src/map/engine';

const controls = vi.hoisted(() => ({ distance: () => 0 }));

vi.mock('three', async (original) => ({
  ...(await original<typeof import('three')>()),
  WebGLRenderer: class {
    domElement = element();
    setClearColor() {}
    setSize() {}
    dispose() {}
    forceContextLoss() {}
  },
}));

vi.mock('three/addons/controls/OrbitControls.js', async (original) => {
  const { OrbitControls } =
    await original<typeof import('three/addons/controls/OrbitControls.js')>();
  return {
    OrbitControls: class extends OrbitControls {
      constructor(camera: ConstructorParameters<typeof OrbitControls>[0]) {
        super(camera, null);
        controls.distance = () => camera.position.distanceTo(this.target);
      }
      dispose() {}
    },
  };
});

function element() {
  return {
    style: {},
    dataset: {},
    append() {},
    setAttribute() {},
    addEventListener() {},
    removeEventListener() {},
    remove() {},
    getBoundingClientRect: () => ({ width: 1000, height: 600 }),
  };
}

afterEach(() => vi.unstubAllGlobals());

it('zoom-in reduces camera distance, zoom-out restores it, and reset restores the overview', () => {
  const media = { matches: false, addEventListener() {}, removeEventListener() {} };
  vi.stubGlobal('matchMedia', () => media);
  vi.stubGlobal('devicePixelRatio', 1);
  vi.stubGlobal('document', { hidden: false, createElement: element, ...element() });
  vi.stubGlobal('requestAnimationFrame', () => 1);
  vi.stubGlobal('cancelAnimationFrame', () => {});
  const Observer = class {
    observe() {}
    disconnect() {}
  };
  vi.stubGlobal('IntersectionObserver', Observer);
  vi.stubGlobal('ResizeObserver', Observer);
  const dataset: CampusDataset = JSON.parse(fs.readFileSync('public/data/ncu-campus.json', 'utf8'));
  const map = mountCampus(
    element() as unknown as HTMLElement,
    [],
    { ...dataset, features: [] },
    () => {},
    () => {},
  );
  try {
    const initial = controls.distance();
    map.command('in');
    expect(controls.distance()).toBeCloseTo(initial / 1.35);
    map.command('out');
    expect(controls.distance()).toBeCloseTo(initial);
    map.command('in');
    map.command('reset');
    expect(controls.distance()).toBeCloseTo(initial);
  } finally {
    map.dispose();
  }
});
