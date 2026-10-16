import { Link, useParams } from 'react-router-dom';
import { Ink } from '../components/Ink';
import { ArrowLeftIcon, ArrowUpRightIcon } from '../components/icons';
import { MapLink, Page, PrototypeNotice, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
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
    <Page plainTitle={event.title} lede={event.summary} className="detail">
      <Link className="text-link back-link" to="/events">
        <ArrowLeftIcon size={18} aria-hidden="true" />
        所有活動
      </Link>
      <PrototypeNotice />
      <div className="detail-grid">
        <section className="detail-main">
          <h2 className="display section-title" data-ink>
            <Ink text={display.sections.about} />
          </h2>
          <p>{event.description}</p>
          <p className="note">尚無報名連結。正式活動與參與條件待公布。</p>
        </section>
        <aside className="facts" aria-label="活動資訊">
          <dl className="rows">
            <div>
              <dt className="note">類型</dt>
              <dd>{categories[event.category]}（虛構示範）</dd>
            </div>
            <div>
              <dt className="note">示範時段</dt>
              <dd>
                {slots.map((entry) => (
                  <span key={entry.id} className="line num">
                    {days.find((d) => d.id === entry.dayId)?.label} {entry.start} 至 {entry.end}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="note">地點</dt>
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
    </Page>
  );
}
