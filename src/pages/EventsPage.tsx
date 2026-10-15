import { EventCard, PageHeader, PrototypeNotice, useDocumentTitle } from '../components/page';
import { snapshot } from '../data/festival';
import '../styles/pages.css';

export default function EventsPage() {
  useDocumentTitle('活動');
  return (
    <main id="route-content" tabIndex={-1} className="page container events">
      <PageHeader
        lines={['活動', '一覽']}
        lede="演出、市集、校園活動與特別企劃，在同一個春天相遇。以下以虛構資料示範探索方式。"
        accent="sakura"
      />
      <PrototypeNotice />
      <ul className="event-grid">
        {snapshot.events.map((event, index) => (
          <li key={event.id} className="reveal">
            <EventCard event={event} index={index} />
          </li>
        ))}
      </ul>
    </main>
  );
}
