import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  ArrowUpRightIcon,
  CompassIcon,
  MinusIcon,
  PlusIcon,
} from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { display } from '../data/display-copy';
import { getLocation, snapshot } from '../data/festival';
import type { GeoCoordinate } from '../geo/coordinates';
import { ORIGIN } from '../geo/coordinates';
import type { CampusDataset } from '../geo/types';
import type { CampusRenderer } from './engine';
import { FlatMap } from './FlatMap';
import { CAMPUS_URL } from './map-data';
import './map.css';

const Debug = import.meta.env.DEV ? lazy(() => import('./RoutingDebug')) : null;

type Phase = 'loading' | 'flat' | 'ready' | 'failed';

export default function MapPage() {
  useDocumentTitle(display.pages.map);
  const [query, setQuery] = useSearchParams();
  const [status, setStatus] = useState('校園資料載入中…');
  const [phase, setPhase] = useState<Phase>('loading');
  const [retry, setRetry] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [data, setData] = useState<CampusDataset | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<CampusRenderer | null>(null);
  const selected = query.get('location') || '';
  const location = getLocation(selected);
  const selection = useRef(selected);
  selection.current = selected;
  const pick = useRef((_id: string) => {});
  pick.current = (id) =>
    setQuery(
      (q) => {
        q.set('location', id);
        return q;
      },
      { preventScrollReset: true },
    );
  const ready = phase === 'ready';

  // biome-ignore lint/correctness/useExhaustiveDependencies: retry is the explicit reload trigger.
  useEffect(() => {
    let disposed = false;
    const abort = new AbortController();
    setPhase('loading');
    setStatus('校園資料載入中…');
    (async () => {
      const response = await fetch(CAMPUS_URL, { signal: abort.signal });
      if (!response.ok) throw Error('campus-data');
      const dataset: CampusDataset = await response.json();
      if (
        !Array.isArray(dataset.features) ||
        dataset.origin.latitude !== ORIGIN.latitude ||
        dataset.origin.longitude !== ORIGIN.longitude
      )
        throw Error('campus-data');
      if (disposed) return;
      setData(dataset);
      setPhase('flat');
      setStatus('地理資料已載入，準備 3D 視角…');
      try {
        const { mountCampus } = await import('./engine');
        if (disposed || !host.current) return;
        engine.current = mountCampus(
          host.current,
          snapshot.locations,
          dataset,
          (id) => pick.current(id),
          (message) => {
            setStatus(message);
            setPhase('flat');
          },
        );
        engine.current.interact(matchMedia('(pointer:fine)').matches);
        engine.current.select(selection.current);
        setPhase('ready');
        setStatus('3D 校園已載入。資料來自 OpenStreetMap，尚未現地驗證。');
      } catch {
        if (!disposed) setStatus('3D 暫時無法顯示，已改用平面圖。地點清單仍可使用。');
      }
    })().catch(() => {
      if (disposed) return;
      setPhase('failed');
      setStatus('校園資料載入失敗。地點清單仍可使用；連線後可重試。');
    });
    return () => {
      disposed = true;
      abort.abort();
      engine.current?.dispose();
      engine.current = null;
    };
  }, [retry]);

  useEffect(() => {
    engine.current?.select(selected);
  }, [selected]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-apply after the renderer becomes ready.
  useEffect(() => {
    engine.current?.interact(interactive || matchMedia('(pointer:fine)').matches);
  }, [interactive, ready]);

  const showRoute = (points: GeoCoordinate[]) => engine.current?.debugRoute(points);
  const related = location ? snapshot.events.filter((e) => e.locationId === location.id) : [];

  return (
    <Page
      title={display.pages.map}
      lede="從真實的中央校園，認識祭典發生的地方。資料來自 OpenStreetMap，建物高度多為估計，尚不可導航。"
      className="map-page"
    >
      <div className="map-workspace">
        <section className="map-stage" aria-label="中央大學校園地圖" data-phase={phase}>
          {data && !ready && <FlatMap data={data} />}
          {phase === 'loading' && <div className="map-skeleton" aria-hidden="true" />}
          <div
            className="map-canvas"
            ref={host}
            tabIndex={ready ? 0 : -1}
            role="group"
            aria-label="校園 3D 視角，聚焦後以方向鍵平移；也可由地點清單選取"
            style={{ visibility: ready ? 'visible' : 'hidden' }}
          />
          <div className="map-tools" role="group" aria-label="地圖視角">
            <button
              type="button"
              disabled={!ready}
              onClick={() => engine.current?.command('in')}
              aria-label="放大"
            >
              <PlusIcon size={20} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => engine.current?.command('out')}
              aria-label="縮小"
            >
              <MinusIcon size={20} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => engine.current?.command('left')}
              aria-label="向左旋轉"
            >
              <ArrowCounterClockwiseIcon size={20} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => engine.current?.command('right')}
              aria-label="向右旋轉"
            >
              <ArrowClockwiseIcon size={20} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => engine.current?.command('reset')}
              aria-label="朝北全覽"
            >
              <CompassIcon size={20} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="map-touch button button-ghost"
            disabled={!ready}
            aria-pressed={interactive}
            onClick={() => setInteractive(!interactive)}
          >
            {interactive ? '完成操作' : '啟用手勢操作'}
          </button>
        </section>

        <aside className="map-panel" aria-labelledby="map-panel-title">
          <p className="map-status" role="status">
            {status}
          </p>
          {phase === 'failed' && (
            <button
              type="button"
              className="button button-ghost"
              onClick={() => setRetry((n) => n + 1)}
            >
              重試載入
            </button>
          )}
          <h2 className="display" id="map-panel-title">
            {display.sections.pick}
          </h2>
          <div className="location-list" role="group" aria-label="地點清單">
            {snapshot.locations.map((l) => (
              <button
                type="button"
                key={l.id}
                aria-pressed={selected === l.id}
                onClick={() => pick.current(l.id)}
              >
                <span>{l.name}</span>
                {!l.geographic && <span className="location-flag">待定位</span>}
              </button>
            ))}
          </div>
          <div className="location-detail" aria-live="polite" aria-atomic="true">
            {selected && !location ? (
              <>
                <h3>找不到這個地點</h3>
                <p>這個 ID 不在目前的版本中，請從清單重新選擇。</p>
              </>
            ) : location ? (
              <>
                <p className="location-kind">
                  {location.geographic ? '區域參考，非導航終點' : '活動位置，尚待確認'}
                </p>
                <h3>{location.name}</h3>
                <p>{location.description}</p>
                {!location.geographic && <p>尚無確認的地理座標，因此不在地圖上放置標記。</p>}
                <p className="small-note">
                  位置來源：{location.source}。無障礙狀態未驗證，尚未提供步行導航。
                </p>
                {related.length > 0 && (
                  <>
                    <h4>相關示範活動</h4>
                    {related.map((e) => (
                      <Link key={e.id} className="text-link" to={`/events/${e.id}`}>
                        {e.title}
                        <ArrowUpRightIcon size={16} aria-hidden="true" />
                      </Link>
                    ))}
                  </>
                )}
              </>
            ) : (
              <p className="small-note">點選地圖上的標記或使用清單。不需要提供目前位置。</p>
            )}
          </div>
        </aside>
      </div>
      <details className="disclosure map-help">
        <summary>操作方式與資料來源</summary>
        <div className="disclosure-body">
          <p>
            桌面：拖曳旋轉、滾輪縮放、右鍵平移；聚焦地圖後可用方向鍵平移。手機：按「啟用手勢操作」後，單指旋轉、雙指縮放與平移。
          </p>
          <p>
            地圖資料 ©{' '}
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors，ODbL</a>。
            <a href={`${import.meta.env.BASE_URL}data/ncu-campus.json`}>下載校園資料</a>，
            <a href={`${import.meta.env.BASE_URL}data/LICENSE.txt`}>來源與授權</a>
            {data && <>，擷取於 {data.source.retrievedAt.slice(0, 10)}</>}。
          </p>
          <p className="small-note">
            社群資料不等於校方測量成果。地形以平面顯示，道路寬度及多數建物高度為視覺估計。未定位的活動不出現在地圖上；本版沒有定位權限請求或公開步行指引。
          </p>
        </div>
      </details>
      {Debug && query.has('debug') && (
        <Suspense fallback={<p>載入開發工具…</p>}>
          <Debug onRoute={showRoute} />
        </Suspense>
      )}
    </Page>
  );
}
