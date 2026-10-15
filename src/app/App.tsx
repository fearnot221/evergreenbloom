import { useEffect, useRef, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router-dom';
import {
  CalendarDotsIcon,
  CaretDownIcon,
  HouseIcon,
  ListIcon,
  MapTrifoldIcon,
  MegaphoneIcon,
  WifiSlashIcon,
  XIcon,
} from '../components/icons';
import { Link, NavLink } from '../components/links';
import { display } from '../data/display-copy';
import { poster } from '../data/poster-copy';
import { PwaPanel, useOnline } from '../pwa/PwaPanel';
import { primaryNav, quickNav } from './nav';
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
  const [menu, setMenu] = useState(false);
  const [english, setEnglish] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const languageButton = useRef<HTMLButtonElement>(null);
  useRouteFocus();

  useEffect(() => {
    if (menu) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [menu]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close transient UI on every navigation.
  useEffect(() => {
    setMenu(false);
    setEnglish(false);
  }, [location.pathname]);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    opener.current = event.currentTarget;
    // The menu grows out of the button that opened it.
    const box = event.currentTarget.getBoundingClientRect();
    dialog.current?.style.setProperty('--ox', `${box.left + box.width / 2}px`);
    dialog.current?.style.setProperty('--oy', `${box.top + box.height / 2}px`);
    setMenu(true);
  };

  return (
    <div className="app" data-route={location.pathname === '/' ? 'home' : 'page'}>
      <a className="skip-link" href="#route-content">
        跳至主要內容
      </a>

      <header className="app-header">
        <Link className="brand" to="/" aria-label="松櫻祭 首頁">
          <span className="poster brand-word" aria-hidden="true">
            {poster.wordmark}
          </span>
          <span className="poster brand-edition" aria-hidden="true">
            {poster.edition}
          </span>
        </Link>
        <nav className="quick-nav" aria-label="主要任務">
          {quickNav.map((item) => (
            <NavLink key={item.to} to={item.to}>
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
            className="round-button latin"
            aria-expanded={english}
            aria-controls="language-notice"
            onClick={() => setEnglish(!english)}
            lang="en"
          >
            EN
          </button>
          <button
            type="button"
            className="menu-button"
            aria-haspopup="dialog"
            aria-expanded={menu}
            onClick={openMenu}
          >
            <ListIcon size={18} weight="bold" aria-hidden="true" />
            選單
          </button>
        </div>
        {english && (
          // biome-ignore lint/a11y/noStaticElementInteractions: Escape closes the notice and returns focus.
          <div
            className="language-notice"
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
              className="button button-ghost"
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
      {/* Keyed by path: fresh loads all share the key "default", which would restore
          one page's scroll position on another. */}
      <ScrollRestoration getKey={(loc) => loc.pathname + loc.search} />

      <footer className="app-footer">
        <div className="wrap footer-grid">
          <p className="serif footer-statement">
            {display.closing.map((line) => (
              <span className="line" key={line}>
                {line}
              </span>
            ))}
          </p>
          <nav className="footer-nav" aria-label="頁尾導覽">
            {primaryNav.map((item) => (
              <Link key={item.to} to={item.to}>
                <span>{item.label}</span>
                <span className="latin">{item.en}</span>
              </Link>
            ))}
          </nav>
          <details className="footer-app" id="app-offline-details">
            <summary>
              應用程式與離線閱讀
              <CaretDownIcon size={16} weight="bold" aria-hidden="true" />
            </summary>
            <PwaPanel />
          </details>
        </div>
        <p className="poster footer-wordmark" aria-hidden="true">
          {poster.wordmark}
        </p>
        <div className="wrap footer-legal">
          <p className="note">
            {poster.school} {poster.edition} 松櫻祭 ·
            學生製作的活動資訊原型，並非國立中央大學正式網站。
          </p>
          <p className="note">
            地圖資料 © OpenStreetMap contributors。插畫為暫用設計，官方視覺素材待提供。
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
        <button type="button" onClick={openMenu} aria-haspopup="dialog" aria-expanded={menu}>
          <ListIcon size={22} aria-hidden="true" />
          選單
        </button>
      </nav>

      <dialog
        className="menu"
        ref={dialog}
        aria-label="網站選單"
        onCancel={() => setMenu(false)}
        onClose={() => {
          setMenu(false);
          opener.current?.focus();
        }}
      >
        <div className="menu-inner wrap">
          <div className="menu-head">
            <span className="poster menu-word" aria-hidden="true">
              {poster.wordmark}
            </span>
            <button
              type="button"
              className="round-button"
              aria-label="關閉選單"
              onClick={() => setMenu(false)}
            >
              <XIcon size={20} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <nav className="menu-nav" aria-label="全部頁面">
            {primaryNav.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={{ '--i': index } as React.CSSProperties}
              >
                <span className="serif">{item.label}</span>
                <span className="latin">{item.en}</span>
              </NavLink>
            ))}
          </nav>
          {/* biome-ignore lint/a11y/useValidAnchor: a real in-page link that also closes the menu. */}
          <a
            className="text-link menu-offline"
            href="#app-offline-details"
            onClick={() => {
              setMenu(false);
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
