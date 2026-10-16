import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Ink } from '../components/Ink';
import { ArrowUpRightIcon } from '../components/icons';
import { Phrases } from '../components/Phrases';
import { CampusPlate } from '../components/Plate';
import { useDocumentTitle } from '../components/page';
import { Roll } from '../components/Roll';
import { SplitSwap } from '../components/SplitSwap';
import { display } from '../data/display-copy';
import { snapshot, story } from '../data/festival';
import { poster } from '../data/poster-copy';
import { DESKTOP, flap, gsap, inkFill, MOTION, useGSAP } from '../motion/gsap';
import { PetalFall } from '../motion/PetalFall';
import { PetalStorm } from '../motion/PetalStorm';
import '../styles/home.css';

/** 即時導向: each second-edition milestone with what a visitor can do about it now. */
const steps = story.timeline.map((step) => ({
  ...step,
  to: step.id ? `/news/${step.id}` : '/play',
  action: step.id ? '閱讀公告' : '安裝集章 App',
}));

const [pine, sakura] = story.meanings;

export default function HomePage() {
  useDocumentTitle('');
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        // Hero: the gust bursts out of the wordmark (PetalStorm) while ink floods the
        // outline; the rest drifts in on the same wind, left to right.
        gsap
          .timeline()
          .add(
            inkFill(document.querySelector('.hero-title') as Element, false) ?? gsap.timeline(),
            0.15,
          )
          .from(
            '.hero-meta > *, .hero .actions',
            { x: -28, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'power2.out' },
            0.5,
          )
          .from('.hero-vertical', { autoAlpha: 0, duration: 1.2, ease: 'power1.out' }, 0.8)
          .from(
            '.hero-ledger > div',
            { x: -20, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power2.out' },
            0.9,
          );

        // 標語: each line of the slogan opens from its centre outward, once; the
        // paragraph follows. No pin, no scrub: it reads as one calm moment.
        gsap
          .timeline({ scrollTrigger: { trigger: '.manifesto', start: 'top 70%', once: true } })
          .fromTo(
            '.manifesto-slogan .line',
            { clipPath: 'inset(0% 50% 0% 50%)', autoAlpha: 0 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              autoAlpha: 1,
              duration: 1.2,
              ease: 'power2.inOut',
              stagger: 0.35,
            },
          )
          .from('.manifesto-body', { autoAlpha: 0, duration: 1, ease: 'power1.out' }, '-=0.4');

        // 圖案遮罩: petals flow through the 櫻 window only while it is on screen.
        gsap.to('.sakura-glyph', {
          backgroundPosition: '+=320px +=640px',
          duration: 24,
          ease: 'none',
          repeat: -1,
          scrollTrigger: {
            trigger: '.sakura-glyph',
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play pause resume pause',
          },
        });

        // 翻牌: when the board arrives, each status flips through to its value.
        gsap.timeline({ scrollTrigger: { trigger: '.board', start: 'top 75%', once: true } }).add(
          gsap.utils.toArray<HTMLElement>('.board-when').map((cell, i) => flap(cell, i * 0.15)),
          0,
        );

        // Section titles flood with ink as they enter.
        for (const title of gsap.utils.toArray<Element>('[data-ink]')) inkFill(title);
      });

      // Parallax, pins and the giant scrolling bands: wide screens only.
      mm.add(DESKTOP, () => {
        // 直書三層: the three vertical columns travel at different speeds.
        for (const column of gsap.utils.toArray<HTMLElement>('.pine-col')) {
          gsap.fromTo(
            column,
            { yPercent: Number(column.dataset.from) },
            {
              yPercent: Number(column.dataset.to),
              ease: 'none',
              scrollTrigger: {
                trigger: '.pine',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        }
        gsap.fromTo(
          '.pine-glyph',
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: '.pine',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );

        // 巨字滑過: two giant lines cross the campus at different speeds, opposite ways.
        gsap.fromTo(
          '.band.is-a',
          { xPercent: 0 },
          {
            xPercent: -28,
            ease: 'none',
            scrollTrigger: {
              trigger: '.campus',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          '.band.is-b',
          { xPercent: -30 },
          {
            xPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: '.campus',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.4,
            },
          },
        );
        gsap.fromTo(
          '.campus-plate .plate-inner',
          { scale: 1.14 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.campus-plate',
              start: 'top bottom',
              end: 'center center',
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <main ref={root} id="route-content" tabIndex={-1} className="home">
      <section className="hero" aria-labelledby="home-title">
        <PetalStorm />
        <div className="wrap hero-grid">
          <p className="hero-meta">
            <span>{poster.school}</span>
            <span>
              {poster.edition} {display.home.kind}
            </span>
          </p>
          <p className="display hero-vertical" aria-hidden="true">
            {display.home.sakuraWords}
          </p>
          <div className="hero-copy">
            <div className="actions">
              <Link className="button" to={steps[0].to}>
                <Roll>{`${steps[0].title}公告`}</Roll>
                <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
              </Link>
              <Link className="button button-ghost" to="/about">
                <Roll>關於我們</Roll>
              </Link>
            </div>
          </div>
          <h1
            className="display hero-title"
            id="home-title"
            aria-label="松櫻祭，國立中央大學第二屆春日校園祭典"
          >
            <Ink text={poster.wordmark} />
          </h1>
          <dl className="hero-ledger">
            <div>
              <dt>狀態</dt>
              <dd className="display">{story.edition.status}</dd>
            </div>
            {story.edition.fields.map((field) => (
              <div key={field.name}>
                <dt>{field.name}</dt>
                <dd className="display">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 小副標: the festival's idea as a two-line slogan, its story beneath. */}
      <section className="manifesto" aria-labelledby="slogan">
        <div className="wrap manifesto-inner">
          <h2 className="display manifesto-slogan" id="slogan">
            {display.home.subtitle.map((line) => (
              <span className="line" key={line}>
                {line}
              </span>
            ))}
          </h2>
          <p className="manifesto-body">
            {story.story}
            {story.intro}
          </p>
        </div>
      </section>

      <section className="pine" aria-labelledby="pine-title">
        <div className="wrap pine-grid">
          <p className="display pine-glyph" aria-hidden="true">
            {pine.name}
          </p>
          <div className="pine-columns">
            <p
              className="display pine-col is-words"
              data-from="12"
              data-to="-18"
              aria-hidden="true"
            >
              {display.home.pineWords}
            </p>
            <h2 className="display pine-col is-title" id="pine-title" data-from="-6" data-to="6">
              {pine.title}
            </h2>
            <p className="pine-col is-text" data-from="18" data-to="-8">
              {pine.text}
            </p>
          </div>
        </div>
      </section>

      <section className="sakura" aria-labelledby="sakura-title">
        <div className="wrap sakura-grid">
          <div className="sakura-copy">
            <p className="display sakura-words" aria-hidden="true">
              {display.home.sakuraWords}
            </p>
            <h2 className="display sakura-title" id="sakura-title">
              <Phrases text={sakura.title} />
            </h2>
            <p>{sakura.text}</p>
            <Link className="text-link" to="/about">
              松櫻祭的故事
              <ArrowUpRightIcon size={18} aria-hidden="true" />
            </Link>
          </div>
          <p className="display sakura-glyph" aria-hidden="true">
            {sakura.name}
          </p>
        </div>
      </section>

      <section className="now" id="now" aria-labelledby="now-title">
        <div className="wrap now-grid">
          <div className="now-head">
            <h2 className="display now-title" id="now-title" data-ink>
              <Ink text={display.home.now.join('')} />
            </h2>
            <p>
              第二屆{story.edition.status}。{story.edition.text}
            </p>
          </div>
          <ol className="board">
            {steps.map((step) => (
              <li key={step.title}>
                <Link className={step.id ? 'board-row is-done' : 'board-row'} to={step.to}>
                  <span className="display board-title">{step.title}</span>
                  <span className="board-when">{step.when}</span>
                  <span className="board-action">
                    {step.action}
                    <ArrowUpRightIcon size={18} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="campus" aria-labelledby="campus-title">
        <div className="campus-stage">
          <p className="display band is-a" aria-hidden="true">
            {display.home.bands[0]}
          </p>
          <CampusPlate className="campus-plate" />
          <p className="display band is-b" aria-hidden="true">
            {display.home.bands[1]}
          </p>
        </div>
        <div className="wrap campus-copy">
          <h2 className="display campus-title" id="campus-title" data-ink>
            <Ink text={display.home.campus} />
          </h2>
          <p>{story.places[0].text}</p>
          <div className="actions">
            <Link className="button" to="/map">
              <Roll>活動地圖</Roll>
            </Link>
            <Link className="button button-ghost" to="/play">
              <Roll>實景集章</Roll>
            </Link>
          </div>
        </div>
      </section>

      <section className="partners-home" aria-labelledby="partners-title">
        <div className="wrap partners-grid">
          <h2 className="display partners-title" id="partners-title">
            <SplitSwap words={display.home.swap} />
          </h2>
          <div className="partners-copy">
            <p>{snapshot.sponsors[0].note}</p>
            <div className="actions">
              <Link className="text-link" to="/partners">
                合作單位
                <ArrowUpRightIcon size={16} aria-hidden="true" />
              </Link>
              <Link className="text-link" to="/news/partner-shops">
                特約商店公告
                <ArrowUpRightIcon size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PetalFall after=".hero" />
    </main>
  );
}
