import { Page, PrototypeNotice, Ticket, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import { snapshot } from '../data/festival';
import '../styles/pages.css';

export default function EventsPage() {
  useDocumentTitle(display.pages.events);
  return (
    <Page
      title={display.pages.events}
      lede="演出、市集、校園活動與特別企劃，在同一個春天相遇。以下以虛構資料示範探索方式。"
      className="events"
    >
      <PrototypeNotice />
      <ul className="ticket-grid">
        {snapshot.events.map((event) => (
          <li key={event.id} className="reveal">
            <Ticket event={event} />
          </li>
        ))}
      </ul>
    </Page>
  );
}
