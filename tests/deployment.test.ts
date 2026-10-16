import fs from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { sitePaths } from '../src/app/site-paths';
import { snapshot } from '../src/data/festival';

describe('website deployment boundary', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  it('does not publish an install manifest or import the game', () => {
    expect(fs.readFileSync('index.html', 'utf8')).not.toContain('rel="manifest"');
    expect(fs.existsSync('src/game')).toBe(false);
    expect(fs.existsSync('src/pwa')).toBe(false);
  });
  it('emits entry paths for every published event and announcement', () => {
    for (const item of snapshot.events) expect(sitePaths).toContain(`/events/${item.id}`);
    for (const item of snapshot.announcements) expect(sitePaths).toContain(`/news/${item.id}`);
    expect(new Set(sitePaths).size).toBe(sitePaths.length);
  });
  it('has no dead game destination before hosting is configured', async () => {
    vi.stubEnv('VITE_PWA_URL', '');
    const { gameHref } = await import('../src/data/deployment');
    expect(gameHref('?spot=lake&k=LAKE-26')).toBeNull();
  });
  it('preserves a QR claim in the external app link', async () => {
    vi.stubEnv('VITE_PWA_URL', 'https://game.example/');
    const { gameHref } = await import('../src/data/deployment');
    expect(gameHref('?spot=lake&k=LAKE-26')).toBe('https://game.example/play?spot=lake&k=LAKE-26');
  });
  it('retires only festival caches and its worker', async () => {
    const removed: string[] = [];
    const listeners: Record<
      string,
      (event: { waitUntil: (promise: Promise<void>) => void }) => void
    > = {};
    let unregistered = false;
    const self = {
      addEventListener: (name: string, listener: (typeof listeners)[string]) => {
        listeners[name] = listener;
      },
      registration: {
        unregister: async () => {
          unregistered = true;
        },
      },
    };
    const caches = {
      keys: async () => ['songying-core-old', 'songying-shell-old', 'other-app'],
      delete: async (name: string) => {
        removed.push(name);
      },
    };
    new Function('self', 'caches', fs.readFileSync('public/sw.js', 'utf8'))(self, caches);
    let finished = Promise.resolve();
    listeners.activate({
      waitUntil: (promise) => {
        finished = promise;
      },
    });
    await finished;
    expect(removed).toEqual(['songying-core-old', 'songying-shell-old']);
    expect(unregistered).toBe(true);
  });
});
