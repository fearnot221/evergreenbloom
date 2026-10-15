import { Link } from 'react-router-dom';
import { PageHeader, useDocumentTitle } from '../components/page';
import '../styles/pages.css';

export default function NotFoundPage({ what = '這一頁' }: { what?: string }) {
  useDocumentTitle('找不到頁面');
  return (
    <main id="route-content" tabIndex={-1} className="page container not-found">
      <PageHeader
        lines={['迷路', '了嗎']}
        lede={`找不到${what}。內容可能尚未收錄於這個版本，或網址有誤。`}
        accent="pine"
      />
      <p className="hero-actions">
        <Link className="button" to="/">
          回到首頁
        </Link>
        <Link className="button button-quiet" to="/news">
          最新消息
        </Link>
      </p>
    </main>
  );
}
