import { Link } from 'react-router-dom';
import { HandHeartIcon } from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import { gsap, MOTION, useGSAP } from '../motion/gsap';
import '../styles/pages.css';

export default function DonatePage() {
  useDocumentTitle(display.pages.donate);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      gsap.fromTo(
        '.liquid',
        { backgroundPositionY: '0%' },
        {
          backgroundPositionY: '62%',
          duration: 2.6,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: '.liquid', start: 'top 80%', once: true },
        },
      );
    });
    return () => mm.revert();
  });
  return (
    <Page
      title={display.pages.donate}
      lede="松櫻祭由學生發起，靠許多人的支持長成。你的捐款會用在祭典的籌備與執行。"
      className="donate"
    >
      {/* 液體填滿: the outlined word fills with sakura as it arrives. No figures: there
          is no donation channel or goal yet. */}
      <p className="display liquid" aria-hidden="true">
        {display.flows.support}
      </p>
      <section className="join" aria-labelledby="donate-title">
        <h2 id="donate-title">
          <HandHeartIcon size={24} aria-hidden="true" /> 捐款管道尚未開放
        </h2>
        <p>
          正式捐款將透過國立中央大學的捐款管道辦理，以便開立收據。管道確認後會在這裡公布連結；
          在那之前，本站不受理任何轉帳，也請不要相信以松櫻祭名義私下募款的帳號。
        </p>
      </section>
      <section aria-labelledby="donate-other">
        <h2 id="donate-other">也可以這樣支持</h2>
        <p>
          加入
          <Link className="text-link" to="/news/crew-recruitment">
            工作人員
          </Link>
          ，或成為
          <Link className="text-link" to="/partners">
            合作單位
          </Link>
          。
        </p>
      </section>
    </Page>
  );
}
