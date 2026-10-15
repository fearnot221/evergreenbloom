import { useParams } from 'react-router-dom';
import { ArrowLeftIcon, ArrowUpRightIcon } from '../components/icons';
import { Link } from '../components/links';
import { MapLink, PageHeader, PrototypeNotice, useDocumentTitle } from '../components/page';
import { categories, days, getEvent, getLocation, snapshot } from '../data/festival';
import NotFoundPage from './NotFoundPage';
import '../styles/pages.css';

export default function EventDetailPage() {
  const { id = '' } = useParams();
  const event = getEvent(id);
  useDocumentTitle(event ? event.title : '找不到活動');
  if (!event) return <NotFoundPage what="這個活動" />;
  const slots = snapshot.program.filter((entry) => entry.eventId === event.id);
  const location = getLocation(event.locationId);

  return (
    <main id="route-content" tabIndex={-1} className="page container detail">
      <Link className="text-link back-link" to="/events">
        <ArrowLeftIcon size={18} aria-hidden="true" />
        所有活動
      </Link>
      <PageHeader
        lines={event.title.split('，')}
        lede={event.summary}
        compact
        morph={`event-${event.id}`}
      />
      <PrototypeNotice />
      <div className="detail-grid">
        <section className="detail-main">
          <h2>關於這個活動</h2>
          <p>{event.description}</p>
          <p className="small-note">尚無報名連結。正式活動與參與條件待公布。</p>
        </section>
        <aside className="detail-facts surface" aria-label="活動資訊">
          <dl>
            <div>
              <dt>類型</dt>
              <dd>{categories[event.category]}（虛構示範）</dd>
            </div>
            <div>
              <dt>示範時段</dt>
              <dd>
                {slots.map((entry) => (
                  <span key={entry.id} className="fact-line">
                    {days.find((d) => d.id === entry.dayId)?.label} {entry.start} 至 {entry.end}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>地點</dt>
              <dd>{location?.name}</dd>
            </div>
          </dl>
          <MapLink locationId={event.locationId} label={event.title} />
          <Link className="text-link" to="/program">
            完整節目表
            <ArrowUpRightIcon size={18} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
