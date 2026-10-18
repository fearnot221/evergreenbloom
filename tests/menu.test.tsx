import { Children, isValidElement, type MouseEvent, type ReactNode } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../src/app/App';

const state = vi.hoisted(() => ({ set: vi.fn() }));
vi.mock('react', async (original) => ({
  ...(await original<typeof import('react')>()),
  useEffect() {},
  useRef: (current: unknown) => ({ current }),
  useState: (initial: unknown) => [initial, state.set],
}));
vi.mock('react-router-dom', async (original) => ({
  ...(await original<typeof import('react-router-dom')>()),
  useLocation: () => ({ pathname: '/map' }),
  useNavigation: () => ({ state: 'idle' }),
}));
vi.mock('../src/app/use-online', () => ({ useOnline: () => true }));
vi.mock('../src/app/use-route-focus', () => ({ useRouteFocus() {} }));

type Props = {
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onClose?: () => void;
  'aria-haspopup'?: string;
  to?: string;
};
function elements(node: ReactNode): Props[] {
  return Children.toArray(node).flatMap((child) =>
    isValidElement<Props>(child) ? [child.props, ...elements(child.props.children)] : [],
  );
}

function open() {
  const nodes = elements(App());
  const trigger = { focus: vi.fn() };
  const main = { focus: vi.fn() };
  vi.stubGlobal('document', { getElementById: () => main });
  nodes
    .find((p) => p['aria-haspopup'] === 'dialog')
    ?.onClick?.({
      currentTarget: trigger,
    } as unknown as MouseEvent<HTMLButtonElement>);
  state.set.mockClear();
  return { nodes, trigger, main, close: nodes.find((p) => p.onClose)?.onClose };
}

afterEach(() => vi.unstubAllGlobals());

it.each(['/map', '/about', '/news'])(
  'closes a normal menu selection of %s and focuses main',
  (to) => {
    const { nodes, trigger, main, close } = open();
    nodes
      .find((p) => p.to === to && p.onClick)
      ?.onClick?.({
        button: 0,
      } as MouseEvent<HTMLAnchorElement>);
    expect(state.set).toHaveBeenCalledWith(false);
    close?.();
    expect(main.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(trigger.focus).not.toHaveBeenCalled();
  },
);

it('restores the opener when dismissed without navigation', () => {
  const { trigger, main, close } = open();
  close?.();
  expect(trigger.focus).toHaveBeenCalled();
  expect(main.focus).not.toHaveBeenCalled();
});

it.each([
  { metaKey: true },
  { ctrlKey: true },
  { shiftKey: true },
  { button: 1 },
  { defaultPrevented: true },
])('keeps modified or cancelled link clicks in the menu: %j', (modifier) => {
  const { nodes, trigger, close } = open();
  nodes
    .find((p) => p.to === '/map' && p.onClick)
    ?.onClick?.({
      button: 0,
      ...modifier,
    } as MouseEvent<HTMLAnchorElement>);
  expect(state.set).not.toHaveBeenCalled();
  close?.();
  expect(trigger.focus).toHaveBeenCalled();
});
