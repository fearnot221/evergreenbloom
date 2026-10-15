import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AboutPage from '../src/pages/AboutPage';
import EventDetailPage from '../src/pages/EventDetailPage';
import EventsPage from '../src/pages/EventsPage';
import HomePage from '../src/pages/HomePage';
import NewsDetailPage from '../src/pages/NewsDetailPage';
import NewsPage from '../src/pages/NewsPage';
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
      </Routes>
    </MemoryRouter>,
  );
}

const text = (html: string) => html.replaceAll('<!-- -->', '');
const h1 = (html: string) => html.match(/<h1[\s\S]*?<\/h1>/g) ?? [];

describe('routes render one main landmark and one h1', () => {
  for (const url of ['/', '/about', '/program', '/events', '/news', '/team', '/visit']) {
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
    expect(render('/program?day=demo-b&category=market')).toContain('沒有符合的時段');
  });
});

describe('detail routes', () => {
  it('renders an event detail with its map link', () => {
    const html = render('/events/lake-study');
    expect(html).toContain('/map?location=lake-plaza');
  });

  it('renders an official announcement as poster lines', () => {
    const html = render('/news/crew-recruitment');
    expect(h1(html)[0]).toContain('工人');
    expect(html).toContain('官方社群');
  });

  it('falls back to the not-found page for unknown ids', () => {
    expect(render('/events/nope')).toContain('找不到這個活動');
    expect(render('/news/nope')).toContain('找不到這則消息');
  });
});
