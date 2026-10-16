import { Link } from 'react-router-dom';
import { Ink } from '../components/Ink';
import { ArrowUpRightIcon } from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { SplitInvert } from '../components/SplitInvert';
import { display } from '../data/display-copy';
import { snapshot } from '../data/festival';
import { gsap, MOTION, useGSAP } from '../motion/gsap';
import '../styles/pages.css';

export default function PartnersPage() {
  useDocumentTitle(display.pages.partners);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      gsap.fromTo(
        '.partners-call .invert',
        { '--split': '-25%' },
        {
          '--split': '125%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.partners-call',
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: 0.6,
          },
        },
      );
    });
    return () => mm.revert();
  });
  return (
    <Page
      title={display.pages.partners}
      lede="這裡列出第二屆松櫻祭的合作單位與贊助夥伴，先以當年度為主。"
      className="partners"
    >
      {/* 雙色反轉: the diagonal between ink and sakura travels as you scroll, the two
          colours trading places: what partners and the festival do for each other. */}
      <h2 className="display partners-call">
        <SplitInvert text={display.flows.partnersCall} />
      </h2>
      <section className="partner-list" aria-labelledby="list-title">
        <h2 className="display section-title" id="list-title" data-ink>
          <Ink text={display.sections.partnerList} />
        </h2>
        <div className="partner-copy">
          {snapshot.sponsors.map((sponsor) => (
            <p className="partner-statement" key={sponsor.id}>
              {sponsor.note}
            </p>
          ))}
          <p className="note">正式標誌將保留原始比例與核准色彩，不會重新繪製。</p>
        </div>
      </section>
      <section className="join" aria-labelledby="shops-title">
        <h2 className="display section-title" id="shops-title" data-ink>
          <Ink text={display.sections.shops} />
        </h2>
        <p>第二屆已公告特約商店。合作店家與優惠內容請以官方社群公告為準。</p>
        <Link className="button" to="/news/partner-shops">
          特約商店公告
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
      </section>
    </Page>
  );
}
