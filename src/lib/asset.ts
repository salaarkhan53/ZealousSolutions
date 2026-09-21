/**
 * Deployment-specific paths.
 *
 * The production site sits at the root of zealoussolutions.us, so both values
 * are empty and nothing changes. The GitHub Pages preview is served from
 * /ZealousSolutions/, and its build sets NEXT_PUBLIC_BASE_PATH to match (see
 * .github/workflows/pages.yml).
 *
 * Next prefixes its own links, scripts and fonts with the base path, but not
 * plain strings such as an <img src>, a fetch URL or a metadata icon, so those
 * go through `asset()`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** True on the GitHub Pages preview build, which has no PHP for the forms. */
export const IS_PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === 'true';

/** A root-relative public path, prefixed with the base path when there is one. */
export const asset = (path: string) => `${BASE_PATH}${path}`;
