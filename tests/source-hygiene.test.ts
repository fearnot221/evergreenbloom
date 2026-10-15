import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { collectCharacters } from '../scripts/fonts/characters.mjs';

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = `${dir}/${entry.name}`;
    return entry.isDirectory() ? files(full) : /\.(tsx?|css)$/.test(entry.name) ? [full] : [];
  });
}

describe('source hygiene', () => {
  it('display font subset covers every character used in src', () => {
    const subset = new Set(fs.readFileSync('public/fonts/songying-display.chars.txt', 'utf8'));
    const missing = [...collectCharacters()].filter((ch) => !subset.has(ch));
    // Run `npm run fonts -- <NotoSansTC-Black.ttf>` after adding new copy.
    expect(missing.join('')).toBe('');
  });

  it('has no em or en dashes in user-facing source', () => {
    const offenders = files('src').filter((file) => /[—–]/.test(fs.readFileSync(file, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('does not reintroduce raw hex colours outside tokens and the map palette', () => {
    const allowed = new Set(['src/map/map-data.ts']);
    const offenders = files('src').filter(
      (file) => !allowed.has(file) && /#[0-9a-fA-F]{6}\b/.test(fs.readFileSync(file, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });
});
