/**
 * Decorative motifs from the second-edition posts: sparkles, sakura and pine cones.
 * Hand-built SVG (no external artwork is copied). All motifs are aria-hidden and
 * coloured only through --motif-* tokens so they follow the light/night sky.
 */
import { type CSSProperties, memo, useId } from 'react';

type MotifProps = { className?: string; style?: CSSProperties };

const SPARKLE_PATH =
  'M50 0C53 35 65 47 100 50C65 53 53 65 50 100C47 65 35 53 0 50C35 47 47 35 50 0Z';

export const Sparkle = memo(function Sparkle({ className = '', style }: MotifProps) {
  const id = useId();
  return (
    <svg
      className={`motif sparkle ${className}`}
      style={style}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: 'var(--motif-sparkle-core)' }} />
          <stop offset="45%" style={{ stopColor: 'var(--motif-sparkle)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--motif-sparkle)' }} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <path d={SPARKLE_PATH} fill={`url(#${id}g)`} />
      <path
        d="M50 18C51.5 38 58 46 72 49"
        fill="none"
        style={{ stroke: 'var(--motif-sparkle-core)' }}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
});

/* One notched cherry petal, base at the origin, tip pointing up. */
const PETAL = 'M0 0C-15-7-25-25-19-41C-15-50-6-51 0-44C6-51 15-50 19-41C25-25 15-7 0 0Z';

export const Sakura = memo(function Sakura({ className = '', style }: MotifProps) {
  const id = useId();
  return (
    <svg
      className={`motif sakura ${className}`}
      style={style}
      viewBox="-55 -55 110 110"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}p`} cx="0" cy="0" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: 'var(--motif-petal-deep)' }} />
          <stop offset="38%" style={{ stopColor: 'var(--motif-petal-deep)' }} stopOpacity="0.75" />
          <stop offset="100%" style={{ stopColor: 'var(--motif-petal)' }} />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d={PETAL} fill={`url(#${id}p)`} />
          <path
            d="M0-4C-2-16-3-26-8-36M0-4C0-18 1-28 3-38M0-4C3-16 6-24 10-34"
            fill="none"
            style={{ stroke: 'var(--motif-petal-deep)' }}
            strokeWidth="0.8"
            opacity="0.55"
          />
        </g>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 11 + (i % 3) * 2.5;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        return (
          <g key={a}>
            <line
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              style={{ stroke: 'var(--motif-petal-deep)' }}
              strokeWidth="0.9"
            />
            <circle cx={x} cy={y} r="1.7" style={{ fill: 'var(--motif-stamen)' }} />
          </g>
        );
      })}
      <circle r="3.6" style={{ fill: 'var(--motif-petal-deep)' }} />
    </svg>
  );
});

/* Pine-cone scale: a rounded shield, opening downwards. */
function scale(w: number, h: number) {
  return `M${-w / 2} 0Q${-w / 2} ${h * 0.72} 0 ${h}Q${w / 2} ${h * 0.72} ${w / 2} 0Q0 ${-h * 0.32} ${-w / 2} 0Z`;
}

const CONE_ROWS = (() => {
  const rows: { y: number; scales: { x: number; w: number; h: number; tone: number }[] }[] = [];
  const count = 11;
  for (let r = 0; r < count; r++) {
    const t = r / (count - 1);
    const y = 8 + t * 150;
    // Widest a little below the middle, narrowing to the stem and the tip.
    const width = 92 * Math.sin(Math.PI * (0.12 + t * 0.8)) ** 0.8;
    const perRow = r % 2 ? 4 : 5;
    const w = (width / perRow) * 1.25;
    const h = 22 + Math.sin(Math.PI * t) * 8;
    const scales = Array.from({ length: perRow }, (_, i) => ({
      x: -width / 2 + (width / perRow) * (i + 0.5),
      w,
      h,
      tone: (r + i) % 3,
    }));
    rows.push({ y, scales });
  }
  return rows;
})();

export const PineCone = memo(function PineCone({ className = '', style }: MotifProps) {
  const id = useId();
  const tones = [`url(#${id}a)`, `url(#${id}b)`, `url(#${id}a)`];
  return (
    <svg
      className={`motif pine-cone ${className}`}
      style={style}
      viewBox="-60 -18 120 200"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--motif-pine-deep)' }} />
          <stop offset="55%" style={{ stopColor: 'var(--motif-pine)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--motif-pine-light)' }} />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--motif-pine-deep)' }} />
          <stop offset="70%" style={{ stopColor: 'var(--motif-pine)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--motif-pine-light)' }} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M-3-16C-1-8-2-2 0 6"
        style={{ stroke: 'var(--motif-pine-deep)' }}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {CONE_ROWS.map((row) => (
        <g key={row.y} transform={`translate(0 ${row.y})`}>
          {row.scales.map((s) => (
            <path
              key={s.x}
              d={scale(s.w, s.h)}
              transform={`translate(${s.x} 0)`}
              fill={tones[s.tone]}
              style={{ stroke: 'var(--motif-pine-deep)' }}
              strokeOpacity="0.55"
              strokeWidth="0.9"
            />
          ))}
        </g>
      ))}
    </svg>
  );
});

/** Small brand mark: a five-petal blossom whose centre is a pine scale. */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`brand-mark ${className}`}
      viewBox="-55 -55 110 110"
      aria-hidden="true"
      focusable="false"
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <path key={angle} d={PETAL} transform={`rotate(${angle})`} fill="currentColor" />
      ))}
      <path d={scale(20, 18)} transform="translate(0 -7)" style={{ fill: 'var(--color-paper)' }} />
    </svg>
  );
}

/** A single loose petal, used for the hero's falling-petal ambience. */
export function Petal({ className = '', style }: MotifProps) {
  return (
    <svg
      className={`motif petal ${className}`}
      style={style}
      viewBox="-26 -54 52 58"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PETAL} style={{ fill: 'var(--motif-petal-deep)' }} opacity="0.85" />
    </svg>
  );
}
