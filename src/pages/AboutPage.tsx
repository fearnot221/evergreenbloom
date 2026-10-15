import { ArrowUpRightIcon } from '../components/icons';
import { PineCone, Sakura } from '../components/motifs';
import { Page, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import { story } from '../data/festival';
import '../styles/pages.css';

export default function AboutPage() {
  useDocumentTitle(display.pages.about);
  return (
    <Page title={display.pages.about} lede={story.intro} className="about">
      <section className="about-names" aria-label="名字的意義">
        {story.meanings.map((meaning) => (
          <article className="about-name reveal" key={meaning.name}>
            <div className="about-name-figure" aria-hidden="true">
              <span className="serif">{meaning.name}</span>
              {meaning.name === '松' ? <PineCone /> : <Sakura />}
            </div>
            <div className="about-name-copy">
              <h2 className="serif">{meaning.title}</h2>
              <p>{meaning.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="places-title">
        <h2 className="serif section-title" id="places-title">
          {display.sections.places}
        </h2>
        <ol className="rows places">
          {story.places.map((place) => (
            <li key={place.id} className="place reveal">
              <p className="place-name">
                <span className="serif">{place.name}</span>
                <span className="note">{place.relation}</span>
              </p>
              <div>
                <h3 className="serif">{place.title}</h3>
                <p>{place.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="history reveal" aria-labelledby="history-title">
        <p className="num history-year" aria-hidden="true">
          2026
        </p>
        <div className="history-copy">
          <h2 className="serif section-title" id="history-title">
            {display.sections.firstEdition}
          </h2>
          <p className="num history-period">{story.history.period}（已結束）</p>
          <p>{story.history.text}</p>
          <a className="text-link" href={story.history.url}>
            {story.history.source}
            <ArrowUpRightIcon size={18} aria-hidden="true" />
          </a>
          <p className="note">
            歷史資料不代表第二屆的節目。Open House 的其他校務活動不自動視為祭典節目。
          </p>
        </div>
      </section>
    </Page>
  );
}
