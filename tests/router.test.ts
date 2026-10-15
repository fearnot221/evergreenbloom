import { describe, expect, it } from 'vitest';
import { primaryNav } from '../src/app/nav';

describe('router', () => {
  it('has a route for every primary navigation item', async () => {
    const { routes } = await import('../src/app/router');
    const paths = new Set(
      routes[0].children?.[0].children?.map((route) => (route.index ? '/' : `/${route.path}`)),
    );
    for (const item of primaryNav) expect(paths.has(item.to)).toBe(true);
    expect(paths.has('/*')).toBe(true);
  });
});
