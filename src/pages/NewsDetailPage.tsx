import { useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/icons';
import { Link } from '../components/links';
import { PageHeader, useDocumentTitle } from '../components/page';
import { officialTopics, snapshot } from '../data/festival';
import NotFoundPage from './NotFoundPage';
import '../styles/pages.css';

export default function NewsDetailPage() {
  const { id = '' } = useParams();
  const item = snapshot.announcements.find((entry) => entry.id === id);
  useDocumentTitle(item ? item.title : '找不到消息');
  if (!item) return <NotFoundPage what="這則消息" />;
  const topic = officialTopics.find((entry) => entry.id === id);
  return (
    <main id="route-content" tabIndex={-1} className="page container detail news-detail">
      <Link className="text-link back-link" to="/news">
        <ArrowLeftIcon size={18} aria-hidden="true" />
        所有消息
      </Link>
      <PageHeader
        lines={topic ? [...topic.lines] : item.title.split('，')}
        lede={item.summary}
        accent={topic ? 'both' : 'sakura'}
        compact={!topic}
        morph={topic ? `topic-${topic.id}` : undefined}
      />
      <article className="news-body surface">
        <p className="news-meta">
          <time dateTime={item.publishedAt ?? undefined}>
            {item.publishedAt?.replaceAll('-', '.') ?? '日期待確認'}
          </time>
          <span>{item.context}</span>
        </p>
        <p>{item.body}</p>
        <p className="small-note">{item.source}。本站不是國立中央大學的正式公告管道。</p>
      </article>
    </main>
  );
}
