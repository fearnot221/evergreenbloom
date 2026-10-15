import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '../components/icons';
import { PageHeader, useDocumentTitle } from '../components/page';
import { snapshot } from '../data/festival';
import '../styles/pages.css';

export default function TeamPage() {
  useDocumentTitle('團隊');
  return (
    <main id="route-content" tabIndex={-1} className="page container team">
      <PageHeader
        lines={['一起', '才成祭典']}
        lede="松櫻祭由學生發起。正式組織名單與聯絡方式待收集，以下是職能分類的示範，並非已確認的團隊編制。"
        accent="both"
      />
      <ol className="role-list">
        {snapshot.organizers.map((organizer, index) => (
          <li key={organizer.id} className="role reveal">
            <span className="display role-index" aria-hidden="true">
              {['企', '創', '場'][index]}
            </span>
            <div>
              <h2>{organizer.role}</h2>
              <p>{organizer.description}</p>
              <p className="small-note">姓名／組織：{organizer.name ?? '待確認'}</p>
            </div>
          </li>
        ))}
      </ol>
      <section className="team-join surface reveal" aria-labelledby="join-title">
        <h2 id="join-title">想加入工作人員？</h2>
        <p>第二屆已公告「工人招募」。組別、名額與報名方式請以官方社群公告為準。</p>
        <Link className="text-link" to="/news/crew-recruitment">
          工人招募公告
          <ArrowUpRightIcon size={18} aria-hidden="true" />
        </Link>
      </section>
      <section className="team-partners" aria-labelledby="partners-title">
        <h2 id="partners-title">合作與贊助</h2>
        {snapshot.sponsors.map((sponsor) => (
          <p key={sponsor.id}>{sponsor.note}</p>
        ))}
        <p className="small-note">
          特約商店資訊見「特約商店」公告。正式標誌將保留原始比例與核准色彩。
        </p>
      </section>
    </main>
  );
}
