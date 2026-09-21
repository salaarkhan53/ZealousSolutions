<?php
/**
 * Zealous Solutions - form handler.
 *
 * The site is a static export, so this script is the only server-side piece.
 * It handles both forms:
 *
 *   form=application  job application, including the CV as an attachment
 *   form=appointment  appointment request from the home page
 *
 * Both are emailed to the recipient below, with a copy to the company address.
 * Every rule enforced in the browser is re-checked here: client-side validation
 * is a convenience, not a control, and this endpoint is directly reachable.
 *
 * Responds with JSON: {"ok":true,"reference":"..."} or {"ok":false,"error":"..."}
 */

declare(strict_types=1);

// Warnings must never reach the response: they would break the JSON and print
// server paths. They still go to the host's error log.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

const RECIPIENT    = 'obsyed1217@gmail.com';
const CC_RECIPIENT = 'ob@zealoussolutions.us';

/**
 * The domain mail is sent from. Fixed rather than read from the request: the
 * Host header is client-controlled, and a From on a domain the server is not
 * authorised for fails SPF and lands in spam.
 */
const SITE_DOMAIN = 'zealoussolutions.us';

const MAX_CV_BYTES = 5242880; // 5 MB

/** Accepted CV types, by extension, with the MIME type they are sent as. */
const CV_TYPES = [
    'pdf'  => 'application/pdf',
    'doc'  => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Role code (used in the subject line) => the exact position title the form
 * sends. Anything else is rejected, so a tampered request can neither rewrite
 * the subject nor put arbitrary text in the Position line.
 */
const ROLES = [
    'CSR'          => 'Customer Sales Representative',
    'Verification' => 'Verification Officer',
    'General'      => 'General application',
];

/*
 * The fixed choices on each form. Keep in step with src/content/site.ts. Only
 * these values are accepted, so nothing a visitor types freely can land in
 * these lines of the email.
 */
const SERVICES   = ['Customer Support', 'Lead Generation', 'Insurance Services', 'Digital Marketing', 'Something else'];
const TIME_SLOTS = ['09:00 to 11:00', '11:00 to 13:00', '13:00 to 15:00', '15:00 to 17:00', '17:00 to 19:00'];
const TIMEZONES  = ['US Eastern (ET)', 'US Central (CT)', 'US Mountain (MT)', 'US Pacific (PT)', 'UK (GMT/BST)', 'Other / I will confirm'];
const EXPERIENCE = ['Fresh', '1 Year', '2 Years', '3 Years', '4+ Years'];

/*
 * Flood protection. Successful sends are counted per visitor and site-wide; a
 * script hammering the endpoint hits the cap long before it can exhaust the
 * host's mail quota or get the domain blacklisted.
 */
const LIMIT_PER_IP     = 5;    // sends per visitor...
const LIMIT_IP_WINDOW  = 600;  // ...per 10 minutes
const LIMIT_GLOBAL     = 60;   // sends across the whole site...
const LIMIT_GLOBAL_WIN = 3600; // ...per hour

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/* -- Plumbing ---------------------------------------------------------- */

function respond(bool $ok, array $extra = [], int $status = 200): void {
    http_response_code($status);
    echo json_encode(array_merge(['ok' => $ok], $extra));
    exit;
}

function fail(string $message, int $status = 422): void {
    respond(false, ['error' => $message], $status);
}

/**
 * A trimmed text field, capped at `$max` characters. Arrays (`name[]=x`) are
 * refused outright rather than cast to the string "Array".
 */
function field(string $key, int $max = 200): string {
    $raw = $_POST[$key] ?? '';
    if (!is_string($raw)) fail('Invalid submission.');
    $value = trim($raw);
    if (mb_strlen($value) > $max) fail('One of the fields is too long. Please shorten it.');
    return $value;
}

/** A field that must be one of a fixed list of choices. */
function choice(string $key, array $allowed, string $message): string {
    $value = field($key);
    if (!in_array($value, $allowed, true)) fail($message);
    return $value;
}

/**
 * Strips CR/LF from anything that reaches a mail header. Without this, a
 * newline in a submitted value could inject extra headers and turn this form
 * into an open relay.
 */
function headerSafe(string $value): string {
    return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
}

function isAllowedPhone(string $raw): bool {
    $d = preg_replace('/[\s\-().]/', '', $raw);
    return (bool)(
        preg_match('/^(?:\+92|0092|92|0)3\d{9}$/', $d) ||
        preg_match('/^(?:\+92|0092|92|0)(?:21|22|41|42|44|51|55|61|62|71|81|91)\d{7,8}$/', $d) ||
        preg_match('/^(?:\+1|001|1)?[2-9]\d{2}[2-9]\d{6}$/', $d)
    );
}

function isNameLike(string $v): bool {
    return (bool)preg_match("/^\p{L}[\p{L}\s'’.-]*$/u", $v)
        && preg_match_all('/\p{L}/u', $v) >= 2;
}

/** Labelled lines, padded so the email body reads as a table. */
function block(array $rows): array {
    $out = [];
    foreach ($rows as $label => $value) {
        $out[] = str_pad($label . ':', 13) . ($value !== '' ? $value : '-');
    }
    return $out;
}

/**
 * Rejects cross-site submissions. Browsers always send Origin on a POST, and a
 * page on another site cannot forge it. Requests with no Origin (curl, some
 * privacy tools) are let through to the other checks.
 */
function checkOrigin(): void {
    $origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin === '') return;

    $originHost = strtolower((string)parse_url($origin, PHP_URL_HOST));
    $ownHost    = strtolower(preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? '')));
    $allowed    = [SITE_DOMAIN, 'www.' . SITE_DOMAIN, $ownHost];

    if (!in_array($originHost, $allowed, true)) {
        fail('Submissions are only accepted from the Zealous Solutions website.', 403);
    }
}

/**
 * Timestamps of recent sends for one bucket, pruned to `$window` seconds.
 * Stored as small JSON files in the system temp directory, keyed by a hash so
 * no raw IP address is written to disk.
 */
function bucketPath(string $key): string {
    return rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'zs_rate_' . hash('sha256', SITE_DOMAIN . '|' . $key) . '.json';
}

function recentSends(string $key, int $window): array {
    $path = bucketPath($key);
    if (!is_file($path)) return [];
    $stamps = json_decode((string)@file_get_contents($path), true);
    if (!is_array($stamps)) return [];
    $cutoff = time() - $window;
    return array_values(array_filter($stamps, static fn($t) => is_int($t) && $t > $cutoff));
}

function recordSend(string $key, int $window): void {
    $stamps   = recentSends($key, $window);
    $stamps[] = time();
    @file_put_contents(bucketPath($key), json_encode($stamps), LOCK_EX);
}

function clientIp(): string {
    return (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function checkRateLimit(): void {
    if (count(recentSends('ip:' . clientIp(), LIMIT_IP_WINDOW)) >= LIMIT_PER_IP) {
        fail('Too many submissions from your connection. Please wait a few minutes, or email us directly.', 429);
    }
    if (count(recentSends('global', LIMIT_GLOBAL_WIN)) >= LIMIT_GLOBAL) {
        fail('We are receiving an unusual number of submissions. Please try again later, or email us directly.', 429);
    }
}

function recordRateLimit(): void {
    recordSend('ip:' . clientIp(), LIMIT_IP_WINDOW);
    recordSend('global', LIMIT_GLOBAL_WIN);

    // Now and then, delete buckets nobody has touched for a couple of hours,
    // so per-visitor files don't pile up in the temp directory.
    if (random_int(1, 20) === 1) {
        $pattern = rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'zs_rate_*.json';
        foreach (glob($pattern) ?: [] as $file) {
            if (@filemtime($file) < time() - 2 * LIMIT_GLOBAL_WIN) @unlink($file);
        }
    }
}

/**
 * Checks the file's own bytes match its extension. Extension alone proves
 * nothing: a renamed executable would otherwise be mailed as "CV.docx".
 */
function signatureMatches(string $ext, string $bytes): bool {
    switch ($ext) {
        case 'pdf':
            return strncmp($bytes, '%PDF-', 5) === 0;
        case 'doc':
            // OLE2 compound document, the container for legacy Word files.
            return strncmp($bytes, "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1", 8) === 0;
        case 'docx':
            // A ZIP whose entries include the Word document part. Entry names
            // are stored uncompressed, so a plain search finds them. Files that
            // carry a VBA project (macros) are refused.
            return strncmp($bytes, "PK\x03\x04", 4) === 0
                && strpos($bytes, 'word/document') !== false
                && strpos($bytes, 'vbaProject.bin') === false;
    }
    return false;
}

/**
 * Builds and sends the message. `$attachment` is null for the appointment
 * form; when present the message becomes multipart with the CV attached.
 */
function deliver(string $subject, array $lines, string $replyName, string $replyEmail, ?array $attachment): bool {
    $body = implode("\r\n", $lines);

    $headers = [
        'From: Zealous Solutions <no-reply@' . SITE_DOMAIN . '>',
        'Reply-To: ' . headerSafe($replyName) . ' <' . headerSafe($replyEmail) . '>',
        'Cc: ' . CC_RECIPIENT,
        'MIME-Version: 1.0',
    ];

    if ($attachment === null) {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $message = $body;
    } else {
        $boundary  = '=_zs_' . bin2hex(random_bytes(12));
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
        $message = implode("\r\n", [
            '--' . $boundary,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            $body,
            '',
            '--' . $boundary,
            'Content-Type: ' . $attachment['mime'] . '; name="' . $attachment['name'] . '"',
            'Content-Transfer-Encoding: base64',
            'Content-Disposition: attachment; filename="' . $attachment['name'] . '"',
            '',
            chunk_split(base64_encode($attachment['bytes'])),
            '--' . $boundary . '--',
            '',
        ]);
    }

    // -f sets the envelope sender to the same domain, which SPF checks.
    return mail(RECIPIENT, headerSafe($subject), $message, implode("\r\n", $headers), '-f no-reply@' . SITE_DOMAIN);
}

/* -- Guards ------------------------------------------------------------ */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('Method not allowed.', 405);
}

checkOrigin();

// Bots fill every field. Accept silently so they learn nothing.
if (field('website') !== '') {
    respond(true, ['reference' => 'IGNORED']);
}

checkRateLimit();

$form = field('form');
if (!in_array($form, ['application', 'appointment'], true)) {
    fail('Unknown form.');
}

// Short, human-quotable and unique in practice: date + 6 random hex digits,
// about 16 million combinations per day.
$reference = date('md') . '-' . strtoupper(bin2hex(random_bytes(3)));

/* -- Shared fields ----------------------------------------------------- */

$name  = field('name', 80);
$email = field('email', 150);
$phone = field('phone', 30);

if ($name === '' || !isNameLike($name))         fail('Enter a valid name.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Enter a valid email address.');
if (!isAllowedPhone($phone))                    fail('Enter a Pakistani or US phone number.');

/* -- Appointment ------------------------------------------------------- */

if ($form === 'appointment') {
    $company  = field('company', 120);
    $service  = choice('service', SERVICES, 'Choose a service.');
    $date     = field('date', 10);
    $time     = choice('time', TIME_SLOTS, 'Choose a preferred time.');
    $timezone = choice('timezone', TIMEZONES, 'Choose your timezone.');
    $message  = field('message', 1500);

    if (field('consent') !== 'true') fail('Please confirm we can contact you.');

    // Strict YYYY-MM-DD, from today up to a year out. Anything else is stale,
    // forged, or a relative phrase like "tomorrow" that PHP would happily parse.
    $parsed = preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)
        ? date_create_immutable_from_format('!Y-m-d', $date)
        : false;
    if (!$parsed || $parsed->format('Y-m-d') !== $date) fail('Choose a preferred date.');
    if ($parsed < date_create_immutable('today'))       fail('Choose today or a future date.');
    if ($parsed > date_create_immutable('today +1 year')) fail('Choose a date within the next year.');

    $subject = sprintf('Zealous Solutions - Appointment Request %s', $reference);
    $lines = array_merge(
        ['New appointment request from the Zealous Solutions website.', ''],
        block([
            'Reference' => $reference,
            'Service'   => $service,
            'Submitted' => date('D, d M Y H:i') . ' (server time)',
        ]),
        ['', '--- Contact ---'],
        block([
            'Name'    => $name,
            'Email'   => $email,
            'Phone'   => $phone,
            'Company' => $company,
        ]),
        ['', '--- Requested slot ---'],
        block([
            'Date'     => $date,
            'Time'     => $time,
            'Timezone' => $timezone,
        ]),
        $message !== '' ? ['', '--- Message ---', $message] : []
    );

    if (!deliver($subject, $lines, $name, $email, null)) {
        fail('We could not send your request. Please email us directly.', 500);
    }
    recordRateLimit();
    respond(true, ['reference' => $reference]);
}

/* -- Application ------------------------------------------------------- */

$code       = field('code', 20);
$position   = field('position', 80);
$address    = field('address', 120);
$city       = field('city', 60);
$state      = field('state', 60);
$experience = choice('experience', EXPERIENCE, 'Select your years of experience.');

if (!isset(ROLES[$code]) || ROLES[$code] !== $position) fail('Unrecognised position.');
if (mb_strlen($address) < 5)               fail('Enter your street address.');
if (!preg_match("/^[\p{L}\p{N}][\p{L}\p{N}\s#,.\/'’-]*$/u", $address)) fail('Enter a valid street address.');
if ($city !== '' && !isNameLike($city))    fail('Enter a valid city.');
if ($state !== '' && !isNameLike($state))  fail('Enter a valid state or province.');

$cv = $_FILES['cv'] ?? null;
if (!is_array($cv) || !is_int($cv['error'] ?? null)) fail('Attach your CV.');

if ($cv['error'] !== UPLOAD_ERR_OK) {
    if ($cv['error'] === UPLOAD_ERR_INI_SIZE || $cv['error'] === UPLOAD_ERR_FORM_SIZE) {
        fail('Your CV is larger than the server allows. Keep it under 5 MB.');
    }
    fail('Attach your CV.');
}

$cvExt  = strtolower(pathinfo(basename((string)$cv['name']), PATHINFO_EXTENSION));
$cvSize = (int)$cv['size'];

if (!isset(CV_TYPES[$cvExt]))           fail('Upload a PDF or Word document.');
if ($cvSize <= 0)                       fail('That file appears to be empty.');
if ($cvSize > MAX_CV_BYTES)             fail('Your CV must be under 5 MB.');
if (!is_uploaded_file($cv['tmp_name'])) fail('Upload failed. Please try again.');

$cvBytes = file_get_contents($cv['tmp_name']);
if ($cvBytes === false) fail('Could not read the uploaded file.');

if (!signatureMatches($cvExt, $cvBytes)) {
    fail($cvExt === 'pdf'
        ? 'That file is not a valid PDF.'
        : 'That file is not a valid Word document. Macro-enabled files are not accepted.');
}

// Rebuild the filename rather than trusting the submitted one.
$safeName = preg_replace('/[^A-Za-z0-9]+/', '-', $name) . '-CV.' . $cvExt;

// e.g. "Zealous Solution Careers - CSR Employee 0921-4F7A2C"
$subject = sprintf('Zealous Solution Careers - %s Employee %s', $code, $reference);
$lines = array_merge(
    ['New job application from the Zealous Solutions website.', ''],
    block([
        'Reference' => $reference,
        'Position'  => $position,
        'Submitted' => date('D, d M Y H:i') . ' (server time)',
    ]),
    ['', '--- Applicant ---'],
    block([
        'Name'       => $name,
        'Email'      => $email,
        'Phone'      => $phone,
        'Experience' => $experience,
    ]),
    ['', '--- Address ---'],
    block([
        'Street' => $address,
        'City'   => $city,
        'State'  => $state,
    ]),
    ['', 'CV attached: ' . $safeName . ' (' . round($cvSize / 1024) . ' KB)']
);

$sent = deliver($subject, $lines, $name, $email, [
    'name'  => $safeName,
    'mime'  => CV_TYPES[$cvExt],
    'bytes' => $cvBytes,
]);

if (!$sent) {
    fail('We could not send your application. Please email it to us directly.', 500);
}

recordRateLimit();
respond(true, ['reference' => $reference]);
