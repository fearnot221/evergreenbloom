import { type ReactNode, useEffect } from 'react';
import {
  categories,
  days,
  getLocation,
  mapHref,
  prototypeNotice,
  snapshot,
} from '../data/festival';
import type { Event } from '../data/model';
import { poster } from '../data/poster-copy';
import { ArrowUpRightIcon, InfoIcon, MapTrifoldIcon } from './icons';
import { Link } from './links';
import { PineCone, Sakura, Sparkle } from './motifs';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · 松櫻祭` : '松櫻祭 · 國立中央大學第二屆春日祭典';
  }, [title]);
}

/**
 * Inner-page layout. On wide screens the title stands as a vertical spine (like the
 * spine of a bound book) beside the content; on narrow screens it sits on top.
 * `serifTitle` must come from display-copy so the serif subset covers it; dynamic
 * titles (events, announcements) use the body face via `plainTitle`.
 */
export function Page({
  title,
  plainTitle,
  lede,
  className = '',
  morph,
  children,
}: {
  title?: string;
  plainTitle?: string;
  lede?: ReactNode;
  className?: string;
  /** View-transition name shared with the poster or ticket that links here. */
  morph?: string;
  children: ReactNode;
}) {
  return (
    <main id="route-content" tabIndex={-1} className={`page ${className}`}>
      <div className="wrap page-grid">
        <header className="page-spine">
          <h1
            className={title ? 'serif page-title' : 'page-title is-plain'}
            style={morph ? { viewTransitionName: morph } : undefined}
          >
            {title ?? plainTitle}
          </h1>
          <p className="poster page-mark" aria-hidden="true">
            {poster.edition} {poster.wordmark}
          </p>
        </header>
        <div className="page-body">
          {lede && <p className="page-lede">{lede}</p>}
          {children}
        </div>
      </div>
    </main>
  );
}

export function PrototypeNotice({ children = prototypeNotice }: { children?: ReactNode }) {
  return (
    <p className="notice">
      <InfoIcon size={16} weight="bold" aria-hidden="true" />
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

/** First fictional time slot for an event, for ticket stubs. */
function firstSlot(eventId: string) {
  const slot = snapshot.program.find((entry) => entry.eventId === eventId);
  if (!slot) return null;
  return { day: days.find((d) => d.id === slot.dayId)?.label ?? '', start: slot.start };
}

/** An event as an admission ticket: a stub with the time, the body with the title. */
export function Ticket({ event }: { event: Event }) {
  const slot = firstSlot(event.id);
  const location = getLocation(event.locationId);
  return (
    <article className="ticket">
      <div className="ticket-stub">
        <span className="latin">{categories[event.category]}</span>
        {slot && (
          <>
            <span className="num ticket-time">{slot.start}</span>
            <span className="ticket-day">{slot.day}</span>
          </>
        )}
      </div>
      <div className="ticket-body">
        <h3 className="ticket-title" style={{ viewTransitionName: `event-${event.id}` }}>
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h3>
        <p>{event.summary}</p>
        <p className="note">{location?.name} · 虛構示範</p>
        <MapLink locationId={event.locationId} label={event.title} />
      </div>
    </article>
  );
}

/** Feeds the pointer position to a poster's soft light (decorative, mouse only). */
function spotlight(event: React.PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const el = event.currentTarget;
  const box = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${event.clientX - box.left}px`);
  el.style.setProperty('--my', `${event.clientY - box.top}px`);
}

const scrollArt = [
  <>
    <Sakura className="scroll-sakura a" />
    <Sparkle className="scroll-sparkle a" />
  </>,
  <>
    <Sakura className="scroll-sakura b" />
    <Sparkle className="scroll-sparkle b" />
  </>,
  <>
    <PineCone className="scroll-pine" />
    <Sparkle className="scroll-sparkle c" />
  </>,
];

/**
 * The three official announcements as hanging scrolls (掛軸): a rod, a poster that
 * unrolls as it enters the viewport, and the post's own lettering.
 */
export function HangingScrolls({ size = 'large' }: { size?: 'large' | 'small' }) {
  const topics = Object.entries(poster.topics);
  return (
    <ul className={`scrolls is-${size}`}>
      {topics.map(([id, lines], index) => (
        <li key={id} className="scroll" style={{ '--i': index } as React.CSSProperties}>
          <span className="scroll-rod" aria-hidden="true" />
          <Link className="scroll-sheet" to={`/news/${id}`} onPointerMove={spotlight}>
            <span className="scroll-art" aria-hidden="true">
              {scrollArt[index]}
            </span>
            <span className="poster scroll-title" style={{ viewTransitionName: `topic-${id}` }}>
              {lines.map((line) => (
                <span className="line" key={line}>
                  {line}
                </span>
              ))}
            </span>
            <span className="poster scroll-byline" aria-hidden="true">
              {poster.school} {poster.edition} {poster.wordmark}
            </span>
            <span className="scroll-cta">
              閱讀公告
              <ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" />
            </span>
          </Link>
          <span className="scroll-rod is-bottom" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export const featuredEvents = snapshot.events.filter((event) => event.featured);
