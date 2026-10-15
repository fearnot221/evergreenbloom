import { type ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  categories,
  getLocation,
  mapHref,
  officialTopics,
  prototypeNotice,
  snapshot,
  story,
} from '../data/festival';
import type { Event } from '../data/model';
import { ArrowUpRightIcon, InfoIcon, MapTrifoldIcon } from './icons';
import { PineCone, Sakura, Sparkle } from './motifs';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · 松櫻祭` : '松櫻祭 · 國立中央大學春日祭典';
  }, [title]);
}

type Accent = 'sakura' | 'pine' | 'both';

/**
 * Poster-style page header: stacked rose display lines, the grey-violet identity
 * line, then one short paragraph. Motifs sit at the edge and may be cropped.
 */
export function PageHeader({
  lines,
  lede,
  accent = 'sakura',
  compact = false,
}: {
  lines: string[];
  lede?: ReactNode;
  accent?: Accent;
  compact?: boolean;
}) {
  return (
    <header className={`page-header${compact ? ' is-compact' : ''}`}>
      <div className="page-header-art" aria-hidden="true">
        {(accent === 'sakura' || accent === 'both') && <Sakura className="header-sakura" />}
        {(accent === 'pine' || accent === 'both') && <PineCone className="header-pine" />}
        <Sparkle className="header-sparkle a" />
        <Sparkle className="header-sparkle b" />
      </div>
      <h1 className="display page-title">
        {lines.map((line) => (
          <span className="display-line" key={line}>
            {line}
          </span>
        ))}
      </h1>
      <p className="byline">國立中央大學 {story.edition.ordinal} 松櫻祭</p>
      {lede && <p className="page-lede">{lede}</p>}
    </header>
  );
}

export function PrototypeNotice({ children = prototypeNotice }: { children?: ReactNode }) {
  return (
    <p className="prototype-notice">
      <InfoIcon size={18} weight="bold" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function MapLink({ locationId, label }: { locationId: string; label: string }) {
  return (
    <Link className="text-link" to={mapHref(locationId)}>
      <MapTrifoldIcon size={18} aria-hidden="true" />
      在地圖查看<span className="sr-only">：{label}</span>
    </Link>
  );
}

/** One event as a ticket-like card. The whole card is not a link; title and map are. */
export function EventCard({ event, index }: { event: Event; index: number }) {
  const location = getLocation(event.locationId);
  return (
    <article className={`event-card tone-${index % 3}`}>
      <p className="event-kind">
        <span>{categories[event.category]}</span>
        <span className="event-flag">虛構示範</span>
      </p>
      <h2 className="event-title">
        <Link to={`/events/${event.id}`}>{event.title}</Link>
      </h2>
      <p className="event-summary">{event.summary}</p>
      <p className="event-place">{location?.name}</p>
      <MapLink locationId={event.locationId} label={event.title} />
    </article>
  );
}

/**
 * Announcement triptych: three square tiles share one continuous sky, the way the
 * official posts read as a single strip on the social grid. Motifs cross the seams.
 */
export function AnnouncementTriptych() {
  return (
    <div className="triptych">
      <div className="triptych-art" aria-hidden="true">
        <PineCone className="tri-pine" />
        <Sakura className="tri-sakura" />
        <Sakura className="tri-sakura small" />
        <Sparkle className="tri-sparkle s1" />
        <Sparkle className="tri-sparkle s2" />
        <Sparkle className="tri-sparkle s3" />
        <Sparkle className="tri-sparkle s4" />
      </div>
      <ul className="triptych-tiles">
        {officialTopics.map((topic) => (
          <li key={topic.id}>
            <Link className="tile" to={`/news/${topic.id}`}>
              <span className="display tile-title">
                {topic.lines.map((line) => (
                  <span className="display-line" key={line}>
                    {line}
                  </span>
                ))}
              </span>
              <span className="tile-byline byline" aria-hidden="true">
                <span className="tile-byline-school">國立中央大學 </span>
                {story.edition.ordinal} 松櫻祭
              </span>
              <span className="tile-more">
                閱讀公告
                <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const featuredEvents = snapshot.events.filter((event) => event.featured);
