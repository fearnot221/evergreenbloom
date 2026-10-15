import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '../components/icons';
import { AnnouncementTriptych, PageHeader, useDocumentTitle } from '../components/page';
import { officialTopics, snapshot } from '../data/festival';
import '../styles/pages.css';

const officialIds = new Set<string>(officialTopics.map((topic) => topic.id));

export default function NewsPage() {
  useDocumentTitle('消息');
  const others = snapshot.announcements.filter((item) => !officialIds.has(item.id));
  return (
    <main id="route-content" tabIndex={-1} className="page container news">
      <PageHeader
        lines={['最新', '消息']}
        lede="第二屆的公告會陸續發布。每則消息都標示來源；正式資訊以官方社群與主辦單位為準。"
        accent="sakura"
      />
      <section aria-labelledby="official-title" className="news-official">
        <h2 className="section-title display" id="official-title">
          官方社群公告
        </h2>
        <AnnouncementTriptych />
      </section>
      <section aria-labelledby="site-title" className="news-site">
        <h2 className="section-title display" id="site-title">
          本站說明
        </h2>
        <ul className="news-list">
          {others.map((item) => (
            <li key={item.id} className="news-item">
              <p className="news-meta">
                <time dateTime={item.publishedAt ?? undefined}>
                  {item.publishedAt?.replaceAll('-', '.') ?? '日期待確認'}
                </time>
                <span>{item.context}</span>
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
    </main>
  );
}
