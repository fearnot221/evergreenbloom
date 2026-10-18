import fs from 'node:fs';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AboutPage from '../src/pages/AboutPage';
import DonatePage from '../src/pages/DonatePage';
import EventDetailPage from '../src/pages/EventDetailPage';
import EventsPage from '../src/pages/EventsPage';
import HomePage from '../src/pages/HomePage';
import NewsDetailPage from '../src/pages/NewsDetailPage';
import NewsPage from '../src/pages/NewsPage';
import PartnersPage from '../src/pages/PartnersPage';
import PlayPage from '../src/pages/PlayPage';
import ProgramPage from '../src/pages/ProgramPage';
import TeamPage from '../src/pages/TeamPage';
import VisitPage from '../src/pages/VisitPage';

function render(url: string) {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/program" element={<ProgramPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/visit" element={<VisitPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/donate" element={<DonatePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const text = (html: string) => html.replaceAll('<!-- -->', '').replace(/<[^>]+>/g, '');
const h1 = (html: string) => html.match(/<h1[\s\S]*?<\/h1>/g) ?? [];

describe('routes render one main landmark and one h1', () => {
  for (const url of [
    '/',
    '/about',
    '/program',
    '/events',
    '/news',
    '/team',
    '/visit',
    '/play',
    '/partners',
    '/donate',
  ]) {
    it(url, () => {
      const html = render(url);
      expect(html.match(/<main /g)).toHaveLength(1);
      expect(h1(html)).toHaveLength(1);
      expect(html).toContain('id="route-content"');
    });
  }
});

describe('program filters', () => {
  it('filters by day and category from the URL', () => {
    expect(text(render('/program?day=demo-b'))).toContain('2 個測試時段');
    expect(text(render('/program?category=market'))).toContain('1 個測試時段');
    expect(text(render('/program?day=demo-b&category=market'))).toContain('沒有符合的時段');
  });
});

describe('detail routes', () => {
  it('renders an event detail with its map link', () => {
    const html = render('/events/lake-study');
    expect(html).toContain('/map?location=lake-plaza');
  });

  it('renders an official announcement as poster lines', () => {
    const html = render('/news/crew-recruitment');
    expect(text(h1(html)[0])).toContain('工人招募');
    expect(html).toContain('官方社群');
  });

  it('falls back to the not-found page for unknown ids', () => {
    expect(render('/events/nope')).toContain('找不到這個活動');
    expect(render('/news/nope')).toContain('找不到這則消息');
  });
});

describe('stamp rally handoff', () => {
  it('directs visitors to the separate app instead of the removed offline-save panel', () => {
    const html = render('/visit');
    expect(text(html)).toContain('官網需要連線閱讀，不提供離線儲存');
    expect(text(html)).not.toContain('應用程式與離線閱讀');
    expect(html).toContain('href="/play"');
  });
  it('explains that installation and progress belong to the separate app', () => {
    const html = text(render('/play?spot=lake&k=lake-26'));
    expect(html).toContain('官網不需要安裝，也不儲存集章紀錄');
    expect(html).not.toContain('已記下');
  });
});

describe('home accessibility', () => {
  it('names the hero heading and keeps the manifesto readable', () => {
    const html = render('/');
    expect(h1(html)[0]).toContain('aria-label="松櫻祭，國立中央大學第二屆春日校園祭典"');
    expect(text(html)).toContain('松的堅忍，櫻的綻放。在中央，把春天一屆一屆傳下去。');
  });
});

/** Text inside every element whose class list includes `display`, from rendered HTML. */
function displayText(html: string) {
  let depth = 0;
  let out = '';
  for (const [, close, tag, attrs, text] of html.matchAll(/<(\/?)([a-z0-9]+)([^>]*)>|([^<]+)/g)) {
    if (text !== undefined) {
      if (depth > 0) out += text;
    } else if (/^(br|img|input|meta|link|hr)$/.test(tag) || attrs?.endsWith('/')) {
      // void element: no depth change
    } else if (close) {
      if (depth > 0) depth -= 1;
    } else if (depth > 0 || /class="[^"]*\bdisplay\b/.test(attrs ?? '')) {
      depth += 1;
    }
  }
  return out;
}

describe('display font', () => {
  it('covers every character the pages set in the display face', () => {
    const subset = new Set(fs.readFileSync('public/fonts/songying-display.chars.txt', 'utf8'));
    const urls = [
      '/',
      '/about',
      '/program',
      '/events',
      '/news',
      '/team',
      '/visit',
      '/play',
      '/partners',
      '/donate',
      '/news/briefing',
      '/events/lake-study',
    ];
    const missing = new Set<string>();
    for (const url of urls)
      for (const ch of displayText(render(url).replaceAll('<!-- -->', '')))
        if (!/\s/.test(ch) && !subset.has(ch) && !ch.startsWith('&')) missing.add(ch);
    // Run `npm run fonts` after adding display copy.
    expect([...missing].join('')).toBe('');
  });
});
