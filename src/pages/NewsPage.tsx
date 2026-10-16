import { Link } from 'react-router-dom';
import { HeadlineSwap } from '../components/HeadlineSwap';
import { Ink } from '../components/Ink';
import { ArrowUpRightIcon } from '../components/icons';
import { AnnouncementCards, Page, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import { officialTopics, snapshot } from '../data/festival';
import '../styles/pages.css';

const officialIds = new Set<string>(officialTopics.map((topic) => topic.id));

export default function NewsPage() {
  useDocumentTitle(display.pages.news);
  const others = snapshot.announcements.filter((item) => !officialIds.has(item.id));
  return (
    <Page
      title={display.pages.news}
      lede="第二屆的公告會陸續發布。每則消息都標示來源；正式資訊以官方社群與主辦單位為準。"
      className="news"
    >
      <HeadlineSwap items={snapshot.announcements} />
      <section aria-labelledby="official-title" className="news-official">
        <h2 className="display section-title" id="official-title" data-ink>
          <Ink text={display.sections.official} />
        </h2>
        <AnnouncementCards />
      </section>
      <section aria-labelledby="site-title">
        <h2 className="display section-title" id="site-title" data-ink>
          <Ink text={display.sections.site} />
        </h2>
        <ul className="rows news-list">
          {others.map((item) => (
            <li key={item.id} className="news-item">
              <p className="note num">
                {item.publishedAt?.replaceAll('-', '.') ?? '日期待確認'} · {item.context}
              </p>
              <h3>
                <Link to={`/news/${item.id}`}>{item.title}</Link>
              </h3>
              <p>{item.summary}</p>
              <Link className="text-link" to={`/news/${item.id}`}>
                閱讀全文
                <ArrowUpRightIcon size={18} aria-hidden="true" />
                <span className="sr-only">：{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
