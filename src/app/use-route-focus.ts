import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map<string, number>();

/**
 * After a path change, wait for the lazily loaded route to render, then restore
 * scroll (Back/Forward) or reset it, and move focus to the new main landmark.
 */
export function useRouteFocus() {
  const location = useLocation();
  const navType = useNavigationType();
  const previous = useRef(location);

  useEffect(() => {
    history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const key = location.key;
    const save = () => positions.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [location.key]);

  useEffect(() => {
    const prior = previous.current;
    previous.current = location;
    if (prior.key === location.key || prior.pathname === location.pathname) return;
    const stage = document.getElementById('route-stage');
    if (!stage) return;
    let settled = false;
    const settle = () => {
      const main = document.getElementById('route-content');
      if (settled || !main || main.getAttribute('aria-busy') === 'true') return;
      settled = true;
      observer.disconnect();
      window.scrollTo(0, navType === 'POP' ? (positions.get(location.key) ?? 0) : 0);
      main.focus({ preventScroll: true });
    };
    const observer = new MutationObserver(settle);
    observer.observe(stage, { childList: true, subtree: true });
    settle();
    return () => observer.disconnect();
  }, [location, navType]);
}
