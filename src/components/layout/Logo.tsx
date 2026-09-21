import { cn } from '@/lib/cn';

/**
 * The supplied logo is a stacked lockup - symbol above the wordmark - which
 * becomes unreadable at header height. So the mark is used on its own and the
 * wordmark is typeset, which also stays crisp on every display.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <img
        src="/symbol.png"
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        className="h-10 w-10 shrink-0"
      />
      <span className="flex flex-col leading-none">
        <span className="gold-text font-display text-[15px] font-extrabold tracking-[0.16em]">
          ZEALOUS
        </span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.38em] text-muted">
          SOLUTIONS
        </span>
      </span>
    </span>
  );
}
