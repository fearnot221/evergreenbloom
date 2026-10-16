/** Separate game deployment; absent until its public HTTPS URL is chosen. */
export const pwaUrl = import.meta.env.VITE_PWA_URL?.replace(/\/$/, '') ?? '';
export const gameHref = (search = '') => (pwaUrl ? `${pwaUrl}/play${search}` : null);
