# Zealous Solutions - Website

A scroll-driven one-page site plus a Careers page, built as a static export for
cPanel/shared hosting.

- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · Motion · Lenis
- **Output:** fully static - no Node runtime needed on the server

---

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Building for deployment

```bash
npm run build        # writes the site to out/
```

Then upload **the contents of `out/`** (not the folder itself) into `public_html`
on the hosting account. `out/.htaccess` is part of that upload - it sets caching,
compression and the 404 page, so make sure your FTP client is showing hidden
files.

To check the build behaves like it will on Apache before uploading:

```bash
npx serve out
```

Visit `/careers/`, `/privacy/` and a nonsense URL to confirm deep links and the
404 page resolve.

---

## The two forms

Both forms post to one PHP script, [`public/send.php`](public/send.php), which
ships with the export and runs on your cPanel server. It needs no API keys or
third-party service.

- **Goes to:** `obsyed1217@gmail.com`, with a copy (Cc) to
  `ob@zealoussolutions.us`. Both are set at the top of `send.php`.
- **Sent from:** `no-reply@zealoussolutions.us` (`SITE_DOMAIN` in `send.php`).
  Reply-To is the visitor, so pressing Reply answers them directly.

### Appointment requests (home page, `#book`)

- **Subject:** `Zealous Solutions - Appointment Request 0921-4F7A2C`
- **Body:** contact details, service, requested date, time and timezone, message

### Job applications (`/careers/apply/`)

"Apply now" on a role passes `?role=<id>`, which sets the position on that page.

- **Subject:** `Zealous Solution Careers - CSR Employee 0921-4F7A2C`, where `CSR`
  or `Verification` is the role's `code` in `site.ts`
- **Body:** name, email, phone, experience and full address
- **Attachment:** the CV, renamed to `Applicant-Name-CV.pdf`

The trailing reference is date plus 6 random characters, so every submission
is its own email thread.

### After your first deploy

1. **Set up SPF and DKIM for the domain** (cPanel > Email Deliverability, then
   "Repair" if it shows problems). Without them, mail sent "from"
   `zealoussolutions.us` to Gmail is likely to land in spam.
2. **Submit both forms on the live site** and check the inbox and the spam folder.
   If nothing arrives, ask your host whether PHP `mail()` is enabled.
3. **The forms post to `/send.php` at the domain root.** If you install the site
   in a subfolder, change `ENDPOINT` in [`src/lib/submitForm.ts`](src/lib/submitForm.ts).

### What `send.php` protects against

- **Every browser rule is re-checked on the server.** Dropdown and radio values
  must match the options in `site.ts` exactly. If you change those options,
  update the matching lists at the top of `send.php` (`SERVICES`, `TIME_SLOTS`,
  `TIMEZONES`, `EXPERIENCE`, `ROLES`) or the new values will be rejected.
- **Flooding:** 5 successful sends per visitor per 10 minutes, 60 per hour across
  the whole site. Limits are at the top of the file.
- **Cross-site posting:** submissions from other websites are refused.
- **Disguised files:** a CV must really be a PDF or Word file, not just be named
  like one. Macro-enabled Word files are refused.
- **Header injection:** line breaks are stripped from anything that reaches a
  mail header.

While running `npm run dev` there is no PHP, so submissions are logged to the
browser console instead of sent. In the production build, if `send.php` is
missing or fails, the visitor sees an error, never a fake success.

---

## Field rules

All validation lives in [`src/lib/validation.ts`](src/lib/validation.ts) and is
shared by both forms, so a rule is changed in one place.

| Field | Rule |
|---|---|
| Names, city, state | Letters, spaces, hyphens and apostrophes. **No digits.** Accents and non-Latin alphabets are allowed. |
| Phone | **Pakistani (`+92` / `03…`) or US (`+1`) only.** Other countries are rejected. |
| Email | Standard format check |
| Street address | Letters, digits and `# , . / - '` |
| Company | Letters, digits and basic punctuation |
| CV | PDF, DOC or DOCX, up to 5 MB. PDFs are checked for a real PDF signature, so renaming a file to `.pdf` will not get through. |

**Note on the phone restriction:** it applies to the appointment form too, so a
prospective client calling from the UK, UAE or anywhere else cannot submit an
enquiry. If that costs you leads, widen `isAllowedPhone` in that file - it is a
single function, and adding a pattern is the whole change.

---

## Editing content

**Almost all text lives in [`src/content/site.ts`](src/content/site.ts)** - headlines,
service descriptions, industries, careers copy, contact details and navigation.
Components read from it and hardcode nothing, so copy changes don't require
touching any layout code.

A few things to know:

- `socials` is an empty array. Footer social icons appear automatically once you
  add `{ label, href }` entries - until then no dead links ship.
- `careers.openRoles` holds the live vacancies. Each entry's `code` (`CSR`,
  `Verification`) is what appears in the application email's subject line - if
  you add a role with a new code, add it to `ALLOWED_CODES` in `send.php` too,
  or submissions for it will be rejected. Emptying the array turns the page into
  a general-application state automatically.
- The requirements listed under each role were drafted from your brief and are
  marked `CONFIRM BEFORE LAUNCH`. Please check them against what you actually
  expect from each hire.
- `stats` and `testimonials` are empty on purpose. **These sections do not render
  until real figures are supplied** - we did not invent client counts or reviews.
- Comments marked `CONFIRM BEFORE LAUNCH` flag claims drafted from the brief
  (compliance posture, response times) that should be verified.
- `/privacy` and `/terms` are drafts and carry a visible review banner. Have
  counsel check them and remove the banner in
  [`src/components/ui/Prose.tsx`](src/components/ui/Prose.tsx).

---

## The mascot animation

The hero mascot is a scroll-scrubbed frame sequence, not a video - it lets the
animation track scroll position exactly and stay sharp at any size.

`npm run build:assets` regenerates everything in `public/` from the original
brand files in `X:\Obaid Ceo\Zealous Solutions`:

- 300 source JPGs are de-duplicated (they contain long runs of identical frames),
  resampled to 160, and written as WebP at two sizes
- `seq/d/` - 1152px wide, ~2.9 MB total, used from 768px up
- `seq/m/` - 640px wide, ~1.2 MB total, used on phones
- Only one set is ever downloaded, chosen at page load
- `seq/poster.webp` paints immediately and is the sole visual for visitors with
  reduced motion enabled, who download no frames at all

You only need to re-run this if the source animation or logo changes. The
generated files are committed.

---

## Still outstanding

- Social profile URLs for the footer
- A public phone number, if it differs from the WhatsApp number
- Real statistics, testimonials or client logos
- Legal review of the Privacy Policy and Terms
