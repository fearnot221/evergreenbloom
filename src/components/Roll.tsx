/** A label that rolls up to a copy of itself on hover (CSS `.roll`, base.css). */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span className="roll-copy" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
