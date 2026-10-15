import { ArrowUpRightIcon } from '../components/icons';
import { Link } from '../components/links';
import { HangingScrolls, Page, useDocumentTitle } from '../components/page';
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
      <section aria-labelledby="official-title" className="news-official">
        <h2 className="serif section-title" id="official-title">
          {display.sections.official}
        </h2>
        <HangingScrolls size="small" />
      </section>
      <section aria-labelledby="site-title">
        <h2 className="serif section-title" id="site-title">
          {display.sections.site}
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
