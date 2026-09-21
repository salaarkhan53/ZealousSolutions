/**
 * Turns the client's raw brand assets into shippable web assets.
 *
 * Source frames arrive as 300 full-HD JPGs (~12 MB) exported from a GIF, and contain
 * long runs of literal duplicates. Shipping them as-is would be a 12 MB hero, so we
 * dedupe, resample to a fixed count, and emit two resolution ladders.
 *
 * Run once: `npm run build:assets`. Outputs are committed.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BRAND_DIR = 'X:/Obaid Ceo/Zealous Solutions';
const FRAMES_DIR = path.join(BRAND_DIR, 'Frames');
const PUBLIC = path.resolve('public');
const SEQ = path.join(PUBLIC, 'seq');

/** How many frames survive into the shipped sequence. */
const TARGET_FRAMES = 160;

/** Desktop and mobile ladders. Mobile phones never fetch the 1280w set. */
const LADDERS = [
  { dir: 'd', width: 1152, quality: 62 },
  { dir: 'm', width: 640, quality: 58 },
];

const pad = (n) => String(n).padStart(4, '0');
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

/**
 * Drops frames identical to their predecessor. The source animation holds each
 * pose for several frames, so this removes roughly a third with zero visual loss.
 */
async function dedupe(files) {
  const kept = [];
  let previousHash = null;
  let rawBytes = 0;

  for (const file of files) {
    const buffer = await readFile(file);
    rawBytes += buffer.byteLength;
    const hash = createHash('sha1').update(buffer).digest('hex');
    if (hash !== previousHash) kept.push(file);
    previousHash = hash;
  }

  return { kept, rawBytes };
}

/** Picks `count` frames spread evenly across the list, always including first and last. */
function resample(files, count) {
  if (files.length <= count) return files;
  const step = (files.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => files[Math.round(i * step)]);
}

async function buildSequence() {
  const entries = (await readdir(FRAMES_DIR))
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort()
    .map((f) => path.join(FRAMES_DIR, f));

  if (!entries.length) throw new Error(`No frames found in ${FRAMES_DIR}`);

  const { kept, rawBytes } = await dedupe(entries);
  const frames = resample(kept, TARGET_FRAMES);
  console.log(
    `frames: ${entries.length} source (${mb(rawBytes)}) → ${kept.length} unique → ${frames.length} shipped`,
  );

  for (const ladder of LADDERS) {
    const outDir = path.join(SEQ, ladder.dir);
    await rm(outDir, { recursive: true, force: true });
    await mkdir(outDir, { recursive: true });

    let total = 0;
    await Promise.all(
      frames.map(async (src, i) => {
        const out = path.join(outDir, `${pad(i + 1)}.webp`);
        const { size } = await sharp(src)
          .resize({ width: ladder.width, withoutEnlargement: true })
          .webp({ quality: ladder.quality, effort: 6 })
          .toFile(out);
        total += size;
      }),
    );

    console.log(
      `  seq/${ladder.dir}: ${frames.length} × ${ladder.width}w = ${mb(total)} (avg ${kb(total / frames.length)})`,
    );
  }

  // Poster: first paint, reduced-motion fallback, and the Careers page still.
  await sharp(frames[0])
    .resize({ width: 1280 })
    .webp({ quality: 78, effort: 6 })
    .toFile(path.join(SEQ, 'poster.webp'));

  await writeFile(
    path.join(SEQ, 'manifest.json'),
    `${JSON.stringify({ frames: frames.length, ladders: LADDERS.map((l) => l.dir) }, null, 2)}\n`,
  );

  return frames.length;
}

async function buildBrand() {
  const logo = path.join(BRAND_DIR, 'Zealous Solution Logo.png');
  const symbol = path.join(BRAND_DIR, 'Zealous Solution Symbol.png');

  // Careers hero: the mascot holding a CV, composed with the same left-hand
  // negative space as the sequence frames so the copy sits the same way.
  const careersSource = path.join(BRAND_DIR, 'For Careers page.png');
  for (const [width, name] of [
    [1600, 'careers-hero.webp'],
    [800, 'careers-hero-sm.webp'],
  ]) {
    const { size } = await sharp(careersSource)
      .resize({ width })
      .webp({ quality: 72, effort: 6 })
      .toFile(path.join(PUBLIC, name));
    console.log(`  ${name}: ${kb(size)}`);
  }

  const jobs = [
    [logo, 'logo.png', 320],
    [logo, 'logo@2x.png', 640],
    [symbol, 'symbol.png', 256],
    [symbol, 'apple-touch-icon.png', 180],
  ];

  for (const [src, name, width] of jobs) {
    const { size } = await sharp(src)
      .resize({ width })
      .png({ compressionLevel: 9, palette: true })
      .toFile(path.join(PUBLIC, name));
    console.log(`  ${name}: ${kb(size)}`);
  }

  // Background emblem on the home page (StickyEmblem). Shown up to ~480 CSS px,
  // so 720px covers 1.5x screens; it sits at low opacity, where the extra
  // sharpness of a 2x asset would not be visible. WebP keeps the alpha
  // channel, which the gloss layer also uses as its mask.
  {
    const { size } = await sharp(symbol)
      .resize({ width: 720 })
      .webp({ quality: 82, alphaQuality: 90, effort: 6 })
      .toFile(path.join(PUBLIC, 'emblem.webp'));
    console.log(`  emblem.webp: ${kb(size)}`);
  }

  // Favicon: sharp has no .ico encoder, so ship a 32px PNG — every current
  // browser accepts it, and the metadata in layout.tsx points at this file.
  await sharp(symbol).resize({ width: 32 }).png().toFile(path.join(PUBLIC, 'icon.png'));

  // OG card: the symbol centred on the brand base colour. A flat background
  // plus one mark palettises down to a fraction of full-colour PNG.
  const mark = await sharp(symbol).resize({ width: 380 }).png().toBuffer();
  const og = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: '#08090C' },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(path.join(PUBLIC, 'og-image.png'));
  console.log(`  og-image.png: ${kb(og.size)}`);

  // The scaffold's stock SVGs would otherwise ship to production.
  for (const junk of ['file.svg', 'globe.svg', 'next.svg', 'vercel.svg', 'window.svg']) {
    await rm(path.join(PUBLIC, junk), { force: true });
  }
}

await mkdir(SEQ, { recursive: true });
console.log('\nBuilding mascot sequence…');
await buildSequence();
console.log('\nBuilding brand assets…');
await buildBrand();
console.log('\nDone.\n');
