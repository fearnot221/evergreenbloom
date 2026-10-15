import { useEffect, useState } from 'react';
import { snapshot } from '../data/festival';

type WorkerReply = { ready: boolean; savedAt?: string; error?: string };
type InstallPrompt = Event & { prompt: () => Promise<void> };

let registrationPromise: Promise<ServiceWorkerRegistration> | undefined;
function registration() {
  registrationPromise ??= navigator.serviceWorker.register('/sw.js', { scope: '/' });
  return registrationPromise;
}

function ask(worker: ServiceWorker, type: string): Promise<WorkerReply> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error('timeout')), 20000);
    channel.port1.onmessage = (event) => {
      clearTimeout(timer);
      resolve(event.data);
      channel.port1.close();
    };
    worker.postMessage({ type }, [channel.port2]);
  });
}

export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}

function formatSaved(saved: string) {
  if (!Number.isFinite(Date.parse(saved))) return saved;
  return new Date(saved).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
}

/** Explicit, user-initiated offline save. The worker never precaches on its own. */
export function PwaPanel() {
  const online = useOnline();
  const [saved, setSaved] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [install, setInstall] = useState<InstallPrompt | null>(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    let alive = true;
    const prompt = (event: Event) => {
      event.preventDefault();
      setInstall(event as InstallPrompt);
    };
    window.addEventListener('beforeinstallprompt', prompt);
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      registration()
        .then(async (reg) => {
          if (!alive) return;
          setUpdate(!!reg.waiting);
          reg.addEventListener('updatefound', () => {
            reg.installing?.addEventListener('statechange', () => {
              if (alive && reg.waiting && navigator.serviceWorker.controller) setUpdate(true);
            });
          });
          await navigator.serviceWorker.ready;
          if (!alive || !reg.active) return;
          const state = await ask(reg.active, 'STATUS');
          if (alive && state.ready) setSaved(state.savedAt || '已儲存');
        })
        .catch(() => {
          if (alive) setStatus('離線功能目前不可用。');
        });
    }
    return () => {
      alive = false;
      window.removeEventListener('beforeinstallprompt', prompt);
    };
  }, []);

  const save = async () => {
    if (!import.meta.env.PROD) {
      setStatus('開發模式不啟用離線快取；請使用本機正式預覽。');
      return;
    }
    setBusy(true);
    setStatus('正在儲存核心頁面…');
    try {
      const reg = await registration();
      await navigator.serviceWorker.ready;
      if (!reg.active) throw new Error('no-worker');
      const result = await ask(reg.active, 'SAVE_CORE');
      if (!result.ready) throw new Error('save-failed');
      setSaved(result.savedAt || '已儲存');
      setStatus('核心頁面已儲存；3D 模組不包含在內。');
    } catch {
      setStatus('未完成儲存。請連線後重試，既有資料不會被取代。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="pwa-panel" id="app-offline" aria-labelledby="pwa-title">
      <h2 id="pwa-title">應用程式與離線閱讀</h2>
      <p>
        {saved
          ? `已儲存本版本（${formatSaved(saved)}，台北時間）。`
          : '可儲存節目、活動、地點清單與來訪資訊，供離線閱讀。3D 地圖不預先下載。'}
      </p>
      <div className="pwa-actions">
        <button
          type="button"
          className="button"
          disabled={busy || !online}
          aria-busy={busy}
          onClick={save}
        >
          {busy ? '儲存中…' : saved ? '重新儲存' : '儲存核心頁面'}
        </button>
        {install && (
          <button
            type="button"
            className="button button-quiet"
            onClick={async () => {
              await install.prompt();
              setInstall(null);
            }}
          >
            安裝應用程式
          </button>
        )}
      </div>
      <p className="pwa-status" role="status">
        {!online ? '目前離線，無法儲存新版本。' : status}
      </p>
      {update && (
        <p className="small-note">有新版本可用。關閉本站所有分頁後重新開啟，再儲存新版內容。</p>
      )}
      <p className="small-note">
        內容版本 {snapshot.revision}。儲存可能被瀏覽器清除；離線內容不保證為最新公告。 iOS 可在
        Safari 分享選單「加入主畫面」。圖示為暫用設計，不是官方標誌。
      </p>
    </section>
  );
}
