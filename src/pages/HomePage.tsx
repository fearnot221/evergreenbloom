import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '../components/icons';
import { Petal, PineCone, Sakura, Sparkle } from '../components/motifs';
import {
  AnnouncementTriptych,
  EventCard,
  featuredEvents,
  PrototypeNotice,
  useDocumentTitle,
} from '../components/page';
import { story } from '../data/festival';
import '../styles/home.css';

const meaningArt = { 松: PineCone, 櫻: Sakura } as const;

/* Start column (%), fall duration (s), delay (s) and size (px) for each loose petal. */
const petals = [
  [8, 19, 0, 18],
  [22, 24, -9, 13],
  [41, 21, -4, 16],
  [58, 26, -15, 12],
  [71, 20, -11, 19],
  [86, 23, -2, 14],
] as const;

export default function HomePage() {
  useDocumentTitle('');
  return (
    <main id="route-content" tabIndex={-1} className="home">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-art" aria-hidden="true">
          <PineCone className="hero-pine" />
          <Sakura className="hero-sakura big" />
          <Sakura className="hero-sakura mid" />
          <Sakura className="hero-sakura low" />
          <Sparkle className="hero-sparkle s1" />
          <Sparkle className="hero-sparkle s2" />
          <Sparkle className="hero-sparkle s3" />
          <div className="petal-fall">
            {petals.map(([x, duration, delay, size]) => (
              <Petal
                key={x}
                style={
                  {
                    '--x': `${x}%`,
                    '--dur': `${duration}s`,
                    '--delay': `${delay}s`,
                    '--size': `${size}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
        <div className="hero-copy">
          <h1 className="display hero-title" id="hero-title">
            松櫻祭
          </h1>
          <p className="byline hero-byline">國立中央大學 {story.edition.ordinal} 春日校園祭典</p>
          <p className="hero-lede">
            {story.headline[0]}
            <br />
            {story.headline[1]}
          </p>
          <div className="hero-actions">
            <Link className="button" to="/news">
              最新消息
            </Link>
            <Link className="button button-quiet" to="/map">
              校園地圖
            </Link>
          </div>
        </div>
      </section>

      <section className="home-news container reveal" aria-labelledby="home-news-title">
        <div className="section-head">
          <h2 className="display section-title" id="home-news-title">
            第二屆，開始了。
          </h2>
          <p>{story.edition.text}</p>
        </div>
        <AnnouncementTriptych />
        <Link className="text-link" to="/news">
          最新消息
          <ArrowUpRightIcon size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="home-story container" aria-labelledby="home-story-title">
        <h2 className="sr-only" id="home-story-title">
          名字的由來
        </h2>
        <div className="meaning-pair">
          {story.meanings.map((meaning) => {
            const Art = meaningArt[meaning.name as keyof typeof meaningArt];
            return (
              <article className="meaning reveal" key={meaning.name}>
                <div className="meaning-figure" aria-hidden="true">
                  <span className="display meaning-glyph">{meaning.name}</span>
                  <Art className="meaning-art" />
                </div>
                <h3>{meaning.title}</h3>
                <p>{meaning.text}</p>
              </article>
            );
          })}
        </div>
        <p className="meaning-note reveal">
          {story.intro}
          <Link className="text-link" to="/about">
            祭典故事
            <ArrowUpRightIcon size={18} aria-hidden="true" />
          </Link>
        </p>
      </section>

      <section className="home-edition container reveal" aria-labelledby="edition-title">
        <div className="edition-panel surface">
          <div>
            <h2 className="display edition-title" id="edition-title">
              <span className="display-line">{story.edition.ordinal}</span>
              <span className="display-line">{story.edition.status}</span>
            </h2>
          </div>
          <dl className="edition-ledger">
            {story.edition.fields.map((field) => (
              <div key={field.name}>
                <dt>{field.name}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
          <p className="edition-history small-note">
            首屆松櫻祭於 {story.history.period} 舉行。
            <a className="text-link" href={story.history.url}>
              {story.history.source}
              <ArrowUpRightIcon size={16} aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>

      <section className="home-events" aria-labelledby="home-events-title">
        <div className="container section-head reveal">
          <h2 className="display section-title" id="home-events-title">
            春天裡，可以做什麼？
          </h2>
          <PrototypeNotice>
            活動、時段與地點為虛構示範，用來測試節目表與地圖的連結，請勿用於安排參與。
          </PrototypeNotice>
        </div>
        <ul className="event-rail container" aria-label="示範活動">
          {featuredEvents.map((event, index) => (
            <li key={event.id}>
              <EventCard event={event} index={index} />
            </li>
          ))}
        </ul>
        <div className="container">
          <Link className="text-link" to="/program">
            示範節目表
            <ArrowUpRightIcon size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="home-campus reveal" aria-labelledby="home-campus-title">
        <div className="container campus-band">
          <h2 className="display campus-title" id="home-campus-title">
            <span className="display-line">走進</span>
            <span className="display-line">中央</span>
          </h2>
          <div className="campus-copy">
            <p>{story.places[1].text}</p>
            <p className="small-note">
              3D 地圖使用 OpenStreetMap 校園資料，尚未現地驗證，目前不提供步行導航。
            </p>
            <div className="hero-actions">
              <Link className="button" to="/map">
                校園地圖
              </Link>
              <Link className="button button-quiet" to="/visit">
                來訪須知
              </Link>
            </div>
          </div>
          <Sparkle className="campus-sparkle a" />
          <Sparkle className="campus-sparkle b" />
        </div>
      </section>
    </main>
  );
}
