import { Link } from '../components/links';
import { Page, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import '../styles/pages.css';

export default function NotFoundPage({ what = '這一頁' }: { what?: string }) {
  useDocumentTitle('找不到頁面');
  return (
    <Page
      title={display.pages.notFound}
      lede={`找不到${what}。內容可能尚未收錄於這個版本，或網址有誤。`}
      className="not-found"
    >
      <p className="actions">
        <Link className="button" to="/">
          回到首頁
        </Link>
        <Link className="button button-ghost" to="/news">
          最新消息
        </Link>
      </p>
    </Page>
  );
}
