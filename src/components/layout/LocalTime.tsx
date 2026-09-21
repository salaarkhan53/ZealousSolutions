'use client';

import { useEffect, useState } from 'react';

/**
 * IANA zone -> ISO country code for the zones visitors are most likely to be
 * in. Browsers expose the timezone but no country, and "Asia/Karachi" only
 * names a city. Anything not listed falls back to the browser locale's region.
 */
const ZONE_COUNTRY: Record<string, string> = {
  // Asia
  'Asia/Karachi': 'PK', 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Dhaka': 'BD',
  'Asia/Kathmandu': 'NP', 'Asia/Colombo': 'LK', 'Asia/Kabul': 'AF', 'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Bahrain': 'BH', 'Asia/Kuwait': 'KW',
  'Asia/Muscat': 'OM', 'Asia/Tehran': 'IR', 'Asia/Baghdad': 'IQ', 'Asia/Amman': 'JO',
  'Asia/Beirut': 'LB', 'Asia/Jerusalem': 'IL', 'Asia/Damascus': 'SY', 'Asia/Tashkent': 'UZ',
  'Asia/Almaty': 'KZ', 'Asia/Baku': 'AZ', 'Asia/Tbilisi': 'GE', 'Asia/Yerevan': 'AM',
  'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'HK', 'Asia/Taipei': 'TW', 'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR', 'Asia/Singapore': 'SG', 'Asia/Kuala_Lumpur': 'MY', 'Asia/Bangkok': 'TH',
  'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH', 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN',
  'Asia/Yangon': 'MM',
  // Europe
  'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Lisbon': 'PT', 'Europe/Madrid': 'ES',
  'Europe/Paris': 'FR', 'Europe/Brussels': 'BE', 'Europe/Amsterdam': 'NL', 'Europe/Berlin': 'DE',
  'Europe/Zurich': 'CH', 'Europe/Vienna': 'AT', 'Europe/Rome': 'IT', 'Europe/Prague': 'CZ',
  'Europe/Warsaw': 'PL', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK',
  'Europe/Helsinki': 'FI', 'Europe/Athens': 'GR', 'Europe/Bucharest': 'RO', 'Europe/Sofia': 'BG',
  'Europe/Budapest': 'HU', 'Europe/Kyiv': 'UA', 'Europe/Kiev': 'UA', 'Europe/Istanbul': 'TR',
  'Europe/Moscow': 'RU',
  // Americas
  'America/New_York': 'US', 'America/Detroit': 'US', 'America/Chicago': 'US',
  'America/Denver': 'US', 'America/Boise': 'US', 'America/Phoenix': 'US',
  'America/Los_Angeles': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US',
  'America/Indiana/Indianapolis': 'US', 'America/Kentucky/Louisville': 'US',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA',
  'America/Winnipeg': 'CA', 'America/Halifax': 'CA', 'America/St_Johns': 'CA',
  'America/Mexico_City': 'MX', 'America/Bogota': 'CO', 'America/Lima': 'PE',
  'America/Santiago': 'CL', 'America/Sao_Paulo': 'BR', 'America/Argentina/Buenos_Aires': 'AR',
  'America/Caracas': 'VE', 'America/Puerto_Rico': 'PR', 'America/Jamaica': 'JM',
  // Africa
  'Africa/Cairo': 'EG', 'Africa/Lagos': 'NG', 'Africa/Nairobi': 'KE', 'Africa/Johannesburg': 'ZA',
  'Africa/Casablanca': 'MA', 'Africa/Accra': 'GH', 'Africa/Addis_Ababa': 'ET', 'Africa/Algiers': 'DZ',
  'Africa/Tunis': 'TN',
  // Oceania
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU', 'Pacific/Auckland': 'NZ',
};

function countryName(zone: string): string {
  let code = ZONE_COUNTRY[zone];
  if (!code) {
    try {
      code = new Intl.Locale(navigator.language).maximize().region ?? '';
    } catch {
      code = '';
    }
  }
  if (!code) return 'Local';
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * The reader's own country and local time, taken from the system clock.
 *
 * Rendered only after mount: the server cannot know the reader's timezone, so
 * emitting a time during SSR would guarantee a hydration mismatch.
 */
export function LocalTime() {
  const [readout, setReadout] = useState<{ country: string; time: string } | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const country = countryName(formatter.resolvedOptions().timeZone ?? '');
    const read = () => ({ country, time: formatter.format(new Date()) });

    setReadout(read());
    // Every 30s keeps the minute honest without running a per-second timer.
    const id = window.setInterval(() => setReadout(read()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <span className="text-gold">{readout?.country ?? 'Local'}</span>
      <span className="tabular-nums" suppressHydrationWarning>
        {readout?.time ?? '--:--'}
      </span>
    </>
  );
}
