import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/icons';
import { Blossom } from '../components/motifs';
import { Page, useDocumentTitle } from '../components/page';
import { snapshot } from '../data/festival';
import { poster } from '../data/poster-copy';
import NotFoundPage from './NotFoundPage';
import '../styles/pages.css';

export default function NewsDetailPage() {
  const { id = '' } = useParams();
  const item = snapshot.announcements.find((entry) => entry.id === id);
  useDocumentTitle(item ? item.title : '找不到消息');
  if (!item) return <NotFoundPage what="這則消息" />;
  const lines = poster.topics[id as keyof typeof poster.topics];

  return (
    <Page plainTitle={item.title} lede={item.summary} className="detail news-detail">
      <Link className="text-link back-link" to="/news">
        <ArrowLeftIcon size={18} aria-hidden="true" />
        所有消息
      </Link>
      <div className="news-detail-grid">
        {lines && (
          <figure className="news-poster" aria-hidden="true">
            <Blossom className="news-poster-sakura" />
            <span className="display news-poster-title">
              {lines.map((line) => (
                <span className="line" key={line}>
                  {line}
                </span>
              ))}
            </span>
            <span className="display news-poster-byline">
              {poster.school} {poster.edition} {poster.wordmark}
            </span>
          </figure>
        )}
        <article className="news-body">
          <p className="note num">
            {item.publishedAt?.replaceAll('-', '.') ?? '日期待確認'} · {item.context}
          </p>
          <p>{item.body}</p>
          <p className="note">{item.source}。本站不是國立中央大學的正式公告管道。</p>
        </article>
      </div>
    </Page>
  );
}
