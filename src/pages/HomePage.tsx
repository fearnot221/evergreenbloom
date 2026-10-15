import { ArrowUpRightIcon } from '../components/icons';
import { Link } from '../components/links';
import { PineCone, Sakura } from '../components/motifs';
import {
  featuredEvents,
  HangingScrolls,
  PrototypeNotice,
  Ticket,
  useDocumentTitle,
} from '../components/page';
import { SkyCanvas } from '../components/SkyCanvas';
import { display } from '../data/display-copy';
import { story } from '../data/festival';
import { poster } from '../data/poster-copy';
import { CampusSketch } from './CampusSketch';
import '../styles/home.css';

const meaningArt = { 松: PineCone, 櫻: Sakura } as const;

/** Pine-ink panel with the wordmark cut out of it: the window onto the spring sky. */
function WindowMask() {
  return (
    <div className="window-art" aria-hidden="true">
      <svg
        aria-hidden="true"
        className="window-mask is-wide"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="window-wide" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1000">
            <rect width="1600" height="1000" fill="white" />
            <text x="800" y="680" textAnchor="middle" className="window-letters" fontSize="470">
              {poster.wordmark}
            </text>
          </mask>
        </defs>
        <rect width="1600" height="1000" mask="url(#window-wide)" className="window-ink" />
      </svg>
      <svg
        aria-hidden="true"
        className="window-mask is-tall"
        viewBox="0 0 1000 1800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="window-tall" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1800">
            <rect width="1000" height="1800" fill="white" />
            {[...poster.wordmark].map((char, i) => (
              <text
                key={char}
                x="500"
                y={640 + i * 470}
                textAnchor="middle"
                className="window-letters"
                fontSize="460"
              >
                {char}
              </text>
            ))}
          </mask>
        </defs>
        <rect width="1000" height="1800" mask="url(#window-tall)" className="window-ink" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  useDocumentTitle('');
  return (
    <>
      <SkyCanvas />
      <main id="route-content" tabIndex={-1} className="home">
        <section className="window sky-window" aria-labelledby="home-title">
          <div className="window-stage">
            <WindowMask />
            <h1 className="sr-only" id="home-title">
              松櫻祭，國立中央大學第二屆春日校園祭典
            </h1>
            <div className="window-meta" aria-hidden="true">
              <p className="poster">{poster.school}</p>
              <p className="poster">{poster.edition} 春日校園祭典</p>
            </div>
          </div>
        </section>

        <section className="statement sky-window" aria-labelledby="statement-title">
          <div className="wrap statement-grid">
            <h2 className="serif vertical statement-title" id="statement-title">
              {display.home.statement.map((line) => (
                <span className="line" key={line}>
                  {line}
                </span>
              ))}
            </h2>
            <div className="statement-copy">
              <p className="poster statement-mark">
                {poster.school} {poster.edition} {poster.wordmark}
              </p>
              <p>{story.intro}</p>
              <div className="actions">
                <Link className="button" to="/news">
                  最新消息
                  <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
                </Link>
                <Link className="button button-ghost" to="/about">
                  祭典故事
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="names" aria-label="名字的由來">
          {story.meanings.map((meaning) => {
            const Art = meaningArt[meaning.name as keyof typeof meaningArt];
            return (
              <article
                className={`name name-${meaning.name === '松' ? 'pine' : 'sakura'}`}
                key={meaning.name}
              >
                <div className="name-figure" aria-hidden="true">
                  <span className="serif name-glyph">{meaning.name}</span>
                  <Art className="name-art" />
                </div>
                <div className="name-copy">
                  <h2 className="serif">{meaning.title}</h2>
                  <p>{meaning.text}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="announce sky-window" aria-labelledby="announce-title">
          <div className="wrap">
            <div className="announce-head">
              <h2 className="serif announce-title" id="announce-title">
                {display.home.news}
              </h2>
              <p>{story.edition.text}</p>
            </div>
            <HangingScrolls />
            <Link className="text-link announce-more" to="/news">
              最新消息
              <ArrowUpRightIcon size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="edition" aria-labelledby="edition-title">
          <div className="wrap edition-grid">
            <p className="serif edition-numeral" aria-hidden="true">
              {display.home.edition.numeral}
            </p>
            <div className="edition-copy">
              <h2 className="serif edition-title" id="edition-title">
                {poster.edition}
                <span className="line">{display.home.edition.status}</span>
              </h2>
              <dl className="ledger">
                {story.edition.fields.map((field) => (
                  <div key={field.name}>
                    <dt>{field.name}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="edition-history">
                首屆於 <span className="num">{story.history.period}</span> 舉行。
                <a className="text-link" href={story.history.url}>
                  {story.history.source}
                  <ArrowUpRightIcon size={16} aria-hidden="true" />
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="pan" aria-labelledby="pan-title">
          <div className="pan-stage">
            <div className="wrap pan-head">
              <h2 className="serif pan-title" id="pan-title">
                {display.home.events}
              </h2>
              <PrototypeNotice>
                活動與時段為虛構示範，用來測試節目表與地圖的連結，請勿用於安排參與。
              </PrototypeNotice>
            </div>
            <ul className="pan-track" aria-label="示範活動">
              {featuredEvents.map((event) => (
                <li key={event.id}>
                  <Ticket event={event} />
                </li>
              ))}
              <li className="pan-end">
                <Link className="pan-end-link" to="/program">
                  <span className="serif">節目</span>
                  <span>完整的示範節目表</span>
                  <ArrowUpRightIcon size={28} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="campus sky-window" aria-labelledby="campus-title">
          <div className="wrap campus-grid">
            <div className="campus-copy">
              <h2 className="serif vertical campus-title" id="campus-title">
                {display.home.campus.map((line) => (
                  <span className="line" key={line}>
                    {line}
                  </span>
                ))}
              </h2>
              <div>
                <p>{story.places[1].text}</p>
                <p className="note">
                  線稿與 3D 地圖來自 OpenStreetMap 社群資料，尚未現地驗證，目前不提供步行導航。
                </p>
                <div className="actions">
                  <Link className="button" to="/map">
                    校園地圖
                  </Link>
                  <Link className="button button-ghost" to="/visit">
                    來訪須知
                  </Link>
                </div>
              </div>
            </div>
            <CampusSketch />
          </div>
        </section>
      </main>
    </>
  );
}
