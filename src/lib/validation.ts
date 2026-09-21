/**
 * Field rules shared by every form on the site.
 *
 * Kept in one place so the booking form and the job application enforce the
 * same standards, and so a rule can be relaxed in a single edit rather than
 * hunted through components.
 */

/** Strips formatting so a number can be pattern-matched. */
export function normalizePhone(input: string): string {
  return input.replace(/[\s\-().]/g, '');
}

/**
 * Pakistani numbers.
 * Mobile:   03XX XXXXXXX / +92 3XX XXXXXXX
 * Landline: 0XX XXXXXXX  / +92 XX XXXXXXX  (major city codes)
 */
const PK_MOBILE = /^(?:\+92|0092|92|0)3\d{9}$/;
const PK_LANDLINE = /^(?:\+92|0092|92|0)(?:21|22|41|42|44|51|55|61|62|71|81|91)\d{7,8}$/;

/**
 * US / NANP numbers: optional +1, then a 10-digit number whose area code and
 * exchange both start 2-9 (0 and 1 are not valid leading digits).
 */
const US = /^(?:\+1|001|1)?[2-9]\d{2}[2-9]\d{6}$/;

/**
 * Zealous recruits in Pakistan and serves US clients, so numbers outside those
 * two regions are rejected. Widening this to other markets means adding a
 * pattern here - nothing else changes.
 */
export function isAllowedPhone(input: string): boolean {
  const digits = normalizePhone(input);
  return PK_MOBILE.test(digits) || PK_LANDLINE.test(digits) || US.test(digits);
}

export const PHONE_MESSAGE =
  'Enter a Pakistani (+92 / 03...) or US (+1) number';

/**
 * People's names: letters from any alphabet, plus the spaces, apostrophes,
 * hyphens and full stops real names contain. Digits are rejected outright.
 */
export const NAME_PATTERN = /^\p{L}[\p{L}\s'’.-]*$/u;
export const NAME_MESSAGE = 'Use letters only, no numbers or symbols';

/** Place names follow the same rule as personal names. */
export const PLACE_PATTERN = NAME_PATTERN;
export const PLACE_MESSAGE = 'Use letters only, no numbers';

/** Street addresses legitimately contain digits, slashes and hashes. */
export const ADDRESS_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s#,./'’-]*$/u;
export const ADDRESS_MESSAGE = 'Enter a valid street address';

/** Company names may contain digits and ampersands. */
export const COMPANY_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s&,.'’-]*$/u;
export const COMPANY_MESSAGE = 'Use letters, numbers and basic punctuation only';

/** A name needs real letters in it, not just punctuation. */
export function hasEnoughLetters(value: string, min = 2): boolean {
  return (value.match(/\p{L}/gu) ?? []).length >= min;
}

/* --- CV upload ------------------------------------------------------- */

export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export const CV_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

export const CV_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/** `accept` attribute for the file input - filters the OS picker up front. */
export const CV_ACCEPT = [...CV_EXTENSIONS, ...CV_MIME_TYPES].join(',');

export function describeCvError(file: File): string | null {
  const name = file.name.toLowerCase();
  const extensionOk = CV_EXTENSIONS.some((ext) => name.endsWith(ext));

  // Browsers report inconsistent MIME types for .doc/.docx, so the extension
  // is the primary check and the MIME type is a secondary allowance.
  if (!extensionOk && !CV_MIME_TYPES.includes(file.type as never)) {
    return 'Upload a PDF or Word document';
  }
  if (file.size > CV_MAX_BYTES) {
    return 'File is too large. Keep it under 5 MB';
  }
  if (file.size === 0) {
    return 'That file appears to be empty';
  }
  return null;
}
