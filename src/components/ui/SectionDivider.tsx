export function SectionDivider() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <div className="relative h-px gold-rule opacity-70">
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold/60" />
      </div>
    </div>
  );
}
