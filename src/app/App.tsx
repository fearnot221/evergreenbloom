import { useEffect, useRef, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  CalendarDotsIcon,
  CaretDownIcon,
  DotsNineIcon,
  HouseIcon,
  MapTrifoldIcon,
  MegaphoneIcon,
  WifiSlashIcon,
  XIcon,
} from '../components/icons';
import { Link, NavLink } from '../components/links';
import { BrandMark, Sparkle } from '../components/motifs';
import { story } from '../data/festival';
import { PwaPanel, useOnline } from '../pwa/PwaPanel';
import { primaryNav, sheetNav } from './nav';
import { useRouteFocus } from './use-route-focus';

const tabs = [
  { to: '/', label: '首頁', icon: HouseIcon },
  { to: '/news', label: '消息', icon: MegaphoneIcon },
  { to: '/program', label: '節目', icon: CalendarDotsIcon },
  { to: '/map', label: '地圖', icon: MapTrifoldIcon },
];

export default function App() {
  const location = useLocation();
  const navigation = useNavigation();
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

      <div
        className="nav-progress"
        role="progressbar"
        aria-label="頁面載入中"
        hidden={navigation.state !== 'loading'}
      />
      <div id="route-stage">
        <Outlet />
      </div>
      <ScrollRestoration />

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
          <div className="footer-side">
            <nav className="footer-nav" aria-label="頁尾導覽">
              {primaryNav.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <details className="footer-app disclosure" id="app-offline-details">
              <summary>
                應用程式與離線閱讀
                <CaretDownIcon size={18} weight="bold" aria-hidden="true" />
              </summary>
              <PwaPanel />
            </details>
          </div>
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
          <a
            className="text-link"
            href="#app-offline-details"
            onClick={() => {
              setSheet(false);
              const panel = document.getElementById('app-offline-details');
              if (panel instanceof HTMLDetailsElement) panel.open = true;
            }}
          >
            應用程式與離線閱讀
          </a>
        </div>
      </dialog>
    </div>
  );
}
