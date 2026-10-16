import { Link } from 'react-router-dom';
import { Bands } from '../components/Bands';
import { Ink } from '../components/Ink';
import { ArrowUpRightIcon, CaretDownIcon } from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import { story } from '../data/festival';
import '../styles/pages.css';

export default function AboutPage() {
  useDocumentTitle(display.pages.about);
  return (
    <Page title={display.pages.about} lede={story.intro} className="about">
      <section aria-labelledby="background-title">
        <h2 className="display section-title" id="background-title" data-ink>
          <Ink text={display.sections.background} />
        </h2>
        <p className="section-lede">{story.story}</p>

        <h3 className="display sub-title">{display.sections.meaning}</h3>
        <div className="meanings">
          {story.meanings.map((meaning) => (
            <article
              className={`meaning reveal ${meaning.name === '松' ? 'is-pine' : 'is-sakura'}`}
              key={meaning.name}
            >
              <p className="display meaning-figure" aria-hidden="true">
                {meaning.name}
              </p>
              <h4 className="display">{meaning.title}</h4>
              <p>{meaning.text}</p>
            </article>
          ))}
        </div>

        <h3 className="display sub-title">{display.sections.places}</h3>
        <ul className="places">
          {story.places.map((place) => (
            <li key={place.id} className="place reveal">
              <p className="place-name">
                <span className="display">{place.name}</span>
                <span className="note">{place.relation}</span>
              </p>
              <h4>{place.title}</h4>
              <p>{place.text}</p>
            </li>
          ))}
        </ul>

        <div className="sustain reveal">
          <h3 className="display">{display.sections.sustain}</h3>
          <p>{story.sustainability.text}</p>
          <p className="note">{story.sustainability.note}</p>
        </div>
      </section>

      <section aria-labelledby="purpose-title">
        <h2 className="display section-title" id="purpose-title" data-ink>
          <Ink text={display.sections.purpose} />
        </h2>
        <ol className="purposes">
          {story.purposes.map((purpose) => (
            <li key={purpose.title} className="reveal">
              <h3 className="display">{purpose.title}</h3>
              <p>{purpose.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="history-title">
        <h2 className="display section-title" id="history-title" data-ink>
          <Ink text={display.sections.history} />
        </h2>
        {/* 斜線帶: the first edition's facts cross behind its record. */}
        <div className="history-stage">
          <div className="history-bands">
            <Bands bands={display.flows.history} variant="cross" />
          </div>
          <article className="edition-card reveal">
            <p className="num edition-year" aria-hidden="true">
              2026
            </p>
            <div>
              <h3 className="display">{story.history.title}</h3>
              <p className="num note">{story.history.period}（已結束）</p>
              <p>{story.history.text}</p>
              <a className="text-link" href={story.history.url}>
                {story.history.source}
                <ArrowUpRightIcon size={18} aria-hidden="true" />
              </a>
              <p className="note">
                歷史資料不代表第二屆的節目。Open House 的其他校務活動不自動視為祭典節目。
              </p>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="current-title">
        <h2 className="display section-title" id="current-title" data-ink>
          <Ink text={display.sections.current} />
        </h2>
        <p className="section-lede">{story.edition.text}</p>
        <ol className="timeline">
          {story.timeline.map((step) => (
            <li key={step.title} className={step.id ? 'is-done' : ''}>
              <details className="timeline-item">
                <summary>
                  <span className="timeline-dot" aria-hidden="true" />
                  <span className="timeline-head">
                    <span className="display">{step.title}</span>
                    <span className="note">{step.when}</span>
                  </span>
                  <CaretDownIcon size={18} weight="bold" aria-hidden="true" />
                </summary>
                <div className="timeline-body">
                  <p>{step.text}</p>
                  <Link className="text-link" to={step.id ? `/news/${step.id}` : '/play'}>
                    {step.id ? '閱讀公告' : '實景集章怎麼玩'}
                    <ArrowUpRightIcon size={18} aria-hidden="true" />
                  </Link>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </section>
    </Page>
  );
}
