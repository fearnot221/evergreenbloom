import { ArrowUpRightIcon, CaretDownIcon } from '../components/icons';
import { Link } from '../components/links';
import { Page, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import { story } from '../data/festival';
import '../styles/pages.css';

const faq = [
  ['需要門票或報名嗎？', '尚未確認。本站不提供報名或售票功能。'],
  ['可以使用無障礙路線嗎？', '校園通道、入口與無障礙資料尚未驗證，不能承諾可達性或提供路線。'],
  [
    '離線可以使用嗎？',
    '在頁尾「應用程式與離線閱讀」成功儲存後，可閱讀本版本的活動、節目、地點清單與來訪資訊。離線內容不代表最新公告；3D 地圖不預先儲存。',
  ],
  [
    '如何安裝到手機？',
    '在支援的瀏覽器使用「安裝應用程式」或「加入主畫面」。iOS 可在 Safari 分享選單加入主畫面。',
  ],
  ['去哪裡詢問主辦單位？', '請透過第二屆松櫻祭的官方社群聯繫。本站不提供推測的帳號或聯絡人。'],
] as const;

export default function VisitPage() {
  useDocumentTitle(display.pages.visit);
  return (
    <Page
      title={display.pages.visit}
      lede="日期、交通與參與條件確認後，這裡會整理成可以直接使用的到訪指引。現在不提供推測的路線或步行時間。"
      className="visit"
    >
      <div className="visit-pair">
        <section className="reveal" aria-labelledby="arrival-title">
          <h2 id="arrival-title">先確認，再出發</h2>
          <p>
            第二屆的日期與場地尚未公布，交通、接駁、停車與開放入口資訊均待確認。請勿依 2026
            首屆的日期或原型地圖安排行程。
          </p>
          <Link className="text-link" to="/news">
            最新消息
            <ArrowUpRightIcon size={18} aria-hidden="true" />
          </Link>
        </section>
        <section className="reveal" aria-labelledby="campus-title">
          <h2 id="campus-title">在校園裡相遇</h2>
          <p>
            3D 地圖採用 OpenStreetMap
            的校園輪廓、建物與道路；建物高度多為估計，活動場地仍待確認，尚不可導航。
          </p>
          <Link className="text-link" to="/map">
            校園地圖
            <ArrowUpRightIcon size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
      <section aria-labelledby="info-title">
        <h2 className="serif section-title" id="info-title">
          {display.sections.before}
        </h2>
        <dl className="rows info-rows">
          {story.attendee.rows.map((row) => (
            <div key={row.title}>
              <dt>{row.title}</dt>
              <dd>{row.text}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="faq-title">
        <h2 className="serif section-title" id="faq-title">
          {display.sections.faq}
        </h2>
        <div className="faq">
          {faq.map(([question, answer]) => (
            <details key={question} className="disclosure">
              <summary>
                {question}
                <CaretDownIcon size={18} weight="bold" aria-hidden="true" />
              </summary>
              <div className="disclosure-body">
                <p>{answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </Page>
  );
}
