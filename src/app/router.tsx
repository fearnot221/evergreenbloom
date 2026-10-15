import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject, redirect } from 'react-router-dom';
import App from './App';
import RouteError from './RouteError';

/** Each page is its own chunk, loaded before the navigation commits. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

/** First paint while the initial route chunk loads: the sky and a page skeleton. */
function InitialFallback() {
  return (
    <>
      <div className="sky" aria-hidden="true" />
      <main className="page container route-loading" aria-busy="true">
        <span className="sr-only">頁面載入中</span>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </main>
    </>
  );
}

export const routes: RouteObject[] = [
  {
    Component: App,
    HydrateFallback: InitialFallback,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, lazy: page(() => import('../pages/HomePage')) },
          { path: 'e', loader: () => redirect('/') },
          { path: 'about', lazy: page(() => import('../pages/AboutPage')) },
          { path: 'news', lazy: page(() => import('../pages/NewsPage')) },
          { path: 'news/:id', lazy: page(() => import('../pages/NewsDetailPage')) },
          { path: 'program', lazy: page(() => import('../pages/ProgramPage')) },
          { path: 'events', lazy: page(() => import('../pages/EventsPage')) },
          { path: 'events/:id', lazy: page(() => import('../pages/EventDetailPage')) },
          { path: 'map', lazy: page(() => import('../map/MapPage')) },
          { path: 'visit', lazy: page(() => import('../pages/VisitPage')) },
          { path: 'team', lazy: page(() => import('../pages/TeamPage')) },
          { path: '*', lazy: page(() => import('../pages/NotFoundPage')) },
        ],
      },
    ],
  },
];

export const createRouter = () => createBrowserRouter(routes);
