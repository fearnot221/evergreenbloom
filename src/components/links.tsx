import type { ComponentProps } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';

/**
 * Router links that opt into the View Transitions API by default. Browsers without
 * it navigate normally; reduced motion removes the animation in transitions.css.
 */
export function Link(props: ComponentProps<typeof RouterLink>) {
  return <RouterLink viewTransition {...props} />;
}

export function NavLink(props: ComponentProps<typeof RouterNavLink>) {
  return <RouterNavLink viewTransition {...props} />;
}
