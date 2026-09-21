/**
 * Drifting gold dust behind the page.
 *
 * Sits as a fixed layer underneath everything, which is what keeps it off the
 * mascot stage and the footer without any coordination: the stage paints an
 * opaque frame over it, and the footer carries a solid background. Sections in
 * between are transparent, so the dust shows through them.
 *
 * Pure CSS. There is already a requestAnimationFrame loop driving the frame
 * sequence and another driving Lenis; a third one for decoration would be
 * competing for the same budget. Only `transform` and `opacity` are animated,
 * so this stays on the compositor.
 */

type Sprinkle = {
  left: number;
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  sway: number;
  glow: boolean;
};

/**
 * Seeded so the server and the browser generate the same field. `Math.random`
 * here would produce different coordinates on each side and trip a hydration
 * mismatch on every load.
 */
function buildField(count: number): Sprinkle[] {
  let seed = 0x5eed;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return Array.from({ length: count }, (_, i) => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 1.2 + rand() * 2.6,
    opacity: 0.22 + rand() * 0.55,
    duration: 11 + rand() * 14,
    // Negative delay starts each one mid-flight, so the field is already
    // drifting on arrival rather than all igniting at once.
    delay: -rand() * 26,
    sway: (rand() - 0.5) * 44,
    // Roughly one in five catches the light; the rest stay flat so the field
    // reads as drifting dust rather than a starfield.
    glow: i % 5 === 0,
  }));
}

const FIELD = buildField(54);

export function SprinkleField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {FIELD.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold animate-[sprinkleFloat_var(--s-dur)_linear_var(--s-delay)_infinite]"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              '--s-op': s.opacity,
              '--s-sway': `${s.sway}px`,
              '--s-dur': `${s.duration}s`,
              '--s-delay': `${s.delay}s`,
              boxShadow: s.glow ? `0 0 ${s.size * 5}px rgba(212,175,55,0.7)` : undefined,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
