import { ArrowUpRightIcon } from '../components/icons';
import { PineCone, Sakura, Sparkle } from '../components/motifs';
import { PageHeader, useDocumentTitle } from '../components/page';
import { story } from '../data/festival';
import '../styles/pages.css';

export default function AboutPage() {
  useDocumentTitle('祭典故事');
  return (
    <main id="route-content" tabIndex={-1} className="page container about">
      <PageHeader lines={['祭典', '故事']} lede={story.intro} accent="both" />

      <section className="about-names" aria-label="名字的意義">
        {story.meanings.map((meaning) => (
          <article className="about-name reveal" key={meaning.name}>
            <div className="about-name-figure" aria-hidden="true">
              <span className="display">{meaning.name}</span>
              {meaning.name === '松' ? <PineCone /> : <Sakura />}
            </div>
            <div>
              <h2>{meaning.title}</h2>
              <p>{meaning.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="about-places" aria-labelledby="places-title">
        <h2 className="display section-title" id="places-title">
          祭典生長的地方
        </h2>
        <ol className="place-list">
          {story.places.map((place) => (
            <li key={place.id} className="reveal">
              <p className="place-name">
                {place.name}
                <span>{place.relation}</span>
              </p>
              <h3>{place.title}</h3>
              <p>{place.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-history surface reveal" aria-labelledby="history-title">
        <Sparkle className="history-sparkle" />
        <p className="history-year display" aria-hidden="true">
          2026
        </p>
        <div>
          <h2 id="history-title">{story.history.title}</h2>
          <p className="history-period">{story.history.period}（已結束）</p>
          <p>{story.history.text}</p>
          <a className="text-link" href={story.history.url}>
            {story.history.source}
            <ArrowUpRightIcon size={18} aria-hidden="true" />
          </a>
          <p className="small-note">
            歷史資料不代表第二屆的節目。Open House 的其他校務活動不自動視為祭典節目。
          </p>
        </div>
      </section>
    </main>
  );
}
