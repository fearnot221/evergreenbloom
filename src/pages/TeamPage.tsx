import { Link } from 'react-router-dom';
import { Bands } from '../components/Bands';
import { Ink } from '../components/Ink';
import { ArrowUpRightIcon } from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import { snapshot } from '../data/festival';
import '../styles/pages.css';

export default function TeamPage() {
  useDocumentTitle(display.pages.team);
  return (
    <Page
      title={display.pages.team}
      lede="松櫻祭由學生發起。正式組織名單與聯絡方式待收集，以下是職能分類的示範，並非已確認的團隊編制。"
      className="team"
    >
      <ol className="roles">
        {snapshot.organizers.map((organizer) => (
          <li key={organizer.id} className="role reveal">
            <h2>{organizer.role}</h2>
            <p>{organizer.description}</p>
            <p className="note">姓名／組織：{organizer.name ?? '待確認'}</p>
          </li>
        ))}
      </ol>
      {/* 封鎖膠帶: the recruitment call crosses the page like tape. */}
      <div className="tape-stage" aria-hidden="true">
        <Bands bands={display.flows.recruit} variant="tape" />
      </div>
      <section className="join reveal" aria-labelledby="join-title">
        <h2 className="display section-title" id="join-title" data-ink>
          <Ink text={display.sections.join} />
        </h2>
        <p>第二屆已公告「工人招募」。組別、名額與報名方式請以官方社群公告為準。</p>
        <Link className="button" to="/news/crew-recruitment">
          工人招募公告
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
      </section>
      <section aria-labelledby="partners-title">
        <h2 className="display section-title" id="partners-title" data-ink>
          <Ink text={display.sections.partners} />
        </h2>
        <Link className="text-link" to="/partners">
          合作單位
          <ArrowUpRightIcon size={18} aria-hidden="true" />
        </Link>
      </section>
    </Page>
  );
}
