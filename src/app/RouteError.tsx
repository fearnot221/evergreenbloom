import { useEffect } from 'react';

/** Shown when a route chunk fails to load (offline, unsaved) or a page throws. */
export default function RouteError() {
  useEffect(() => {
    document.title = '暫時打不開 · 松櫻祭';
  }, []);
  return (
    <main id="route-content" tabIndex={-1} className="page container route-error">
      <h1 className="display page-title">
        <span className="display-line">暫時</span>
        <span className="display-line">打不開</span>
      </h1>
      <p>可能是連線中斷，或這一頁尚未儲存為離線內容。請恢復連線後重新開啟。</p>
      <p className="route-error-actions">
        <a className="button" href={window.location.href}>
          重新載入
        </a>
        <a className="button button-quiet" href="/program">
          開啟節目表
        </a>
      </p>
    </main>
  );
}
