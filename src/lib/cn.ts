/** Joins class names, dropping falsy values. Keeps conditional classes readable in JSX. */
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}
