import { Component, lazy, type ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  CalendarDotsIcon,
  DotsNineIcon,
  HouseIcon,
  MapTrifoldIcon,
  MegaphoneIcon,
  WifiSlashIcon,
  XIcon,
} from '../components/icons';
import { BrandMark, Sparkle } from '../components/motifs';
import { story } from '../data/festival';
import { PwaPanel, useOnline } from '../pwa/PwaPanel';
import { primaryNav, sheetNav } from './nav';
import { useRouteFocus } from './use-route-focus';

const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ProgramPage = lazy(() => import('../pages/ProgramPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'));
const NewsPage = lazy(() => import('../pages/NewsPage'));
const NewsDetailPage = lazy(() => import('../pages/NewsDetailPage'));
const TeamPage = lazy(() => import('../pages/TeamPage'));
const VisitPage = lazy(() => import('../pages/VisitPage'));
const MapPage = lazy(() => import('../map/MapPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
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
}

function RouteFallback() {
  return (
    <main className="page container route-loading" aria-busy="true">
      <span className="sr-only">頁面載入中</span>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </main>
  );
}

const tabs = [
  { to: '/', label: '首頁', icon: HouseIcon },
  { to: '/news', label: '消息', icon: MegaphoneIcon },
  { to: '/program', label: '節目', icon: CalendarDotsIcon },
  { to: '/map', label: '地圖', icon: MapTrifoldIcon },
];

export default function App() {
  const location = useLocation();
  const online = useOnline();
  const [sheet, setSheet] = useState(false);
  const [english, setEnglish] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const moreButton = useRef<HTMLButtonElement>(null);
  const languageButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useRouteFocus();

  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      document.documentElement.style.setProperty('--app-header', `${el.offsetHeight}px`),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (sheet) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [sheet]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close transient UI on every navigation.
  useEffect(() => {
    setSheet(false);
    setEnglish(false);
  }, [location.pathname]);

  return (
    <div className="app">
      <div className="sky" aria-hidden="true" />
      <a className="skip-link" href="#route-content">
        跳至主要內容
      </a>
      <header className="app-header" ref={header}>
        <div className="app-header-inner">
          <Link className="brand" to="/" aria-label="松櫻祭 首頁">
            <BrandMark />
            <span className="brand-name" aria-hidden="true">
              松櫻祭
            </span>
            <span className="brand-edition" aria-hidden="true">
              {story.edition.ordinal}
            </span>
          </Link>
          <nav className="primary-nav" aria-label="主要導覽">
            {primaryNav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-tools">
            {!online && (
              <span className="offline-pill" role="status">
                <WifiSlashIcon size={16} weight="bold" aria-hidden="true" />
                離線閱讀
              </span>
            )}
            <button
              type="button"
              ref={languageButton}
              className="language-trigger"
              aria-expanded={english}
              aria-controls="language-notice"
              onClick={() => setEnglish(!english)}
              lang="en"
            >
              EN
            </button>
          </div>
        </div>
        {english && (
          // biome-ignore lint/a11y/noStaticElementInteractions: Escape closes the notice and returns focus.
          <div
            className="language-notice surface"
            id="language-notice"
            lang="en"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setEnglish(false);
                languageButton.current?.focus();
              }
            }}
          >
            <p>
              <strong>Traditional Chinese only for now.</strong> English translations are not yet
              available.
            </p>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => {
                setEnglish(false);
                languageButton.current?.focus();
              }}
            >
              Continue in Chinese
            </button>
          </div>
        )}
      </header>

      <div id="route-stage">
        <RouteBoundary key={location.pathname}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/e" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/program" element={<ProgramPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/visit" element={<VisitPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </RouteBoundary>
      </div>

      <footer className="app-footer">
        <div className="container footer-grid">
          <div className="footer-closing">
            <Sparkle className="footer-sparkle" />
            <p className="display footer-title">
              <span className="display-line">在中央，</span>
              <span className="display-line">等一個春天。</span>
            </p>
            <p className="byline">國立中央大學 {story.edition.ordinal} 松櫻祭</p>
          </div>
          <nav className="footer-nav" aria-label="頁尾導覽">
            {primaryNav.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
          <PwaPanel />
          <p className="footer-legal small-note">
            本站為學生製作的活動資訊原型，並非國立中央大學正式網站。地圖資料 © OpenStreetMap
            contributors。插畫為暫用設計，官方視覺素材待提供。
          </p>
        </div>
      </footer>

      <nav className="tab-bar" aria-label="行動導覽">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <Icon size={22} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          ref={moreButton}
          onClick={() => setSheet(true)}
          aria-haspopup="dialog"
          aria-expanded={sheet}
        >
          <DotsNineIcon size={22} aria-hidden="true" />
          更多
        </button>
      </nav>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click mirrors the native Escape close. */}
      <dialog
        className="sheet"
        ref={dialog}
        aria-labelledby="sheet-title"
        onCancel={() => setSheet(false)}
        onClose={() => {
          setSheet(false);
          moreButton.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSheet(false);
        }}
      >
        <div className="sheet-body">
          <div className="sheet-head">
            <h2 id="sheet-title">更多頁面</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="關閉"
              onClick={() => setSheet(false)}
            >
              <XIcon size={20} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <nav className="sheet-nav" aria-label="更多頁面">
            {sheetNav.map((item) => (
              <Link key={item.to} to={item.to}>
                <span className="display">{item.label}</span>
                <ArrowUpRightIcon size={20} aria-hidden="true" />
              </Link>
            ))}
          </nav>
          {/* biome-ignore lint/a11y/useValidAnchor: a real in-page link that also closes the sheet. */}
          <a className="text-link" href="#app-offline" onClick={() => setSheet(false)}>
            應用程式與離線閱讀
          </a>
        </div>
      </dialog>
    </div>
  );
}
