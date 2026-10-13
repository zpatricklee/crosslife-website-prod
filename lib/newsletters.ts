export type Newsletter = {
  /** URL-safe id, the issue date (YYYY-MM-DD), de-duplicated if two share a date. */
  slug: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  title: string;
  /** Published-to-web Google Doc URL, normalised for iframe embedding. */
  embedUrl: string;
  /** Same document without the embed chrome, for "open in a new tab". */
  docUrl: string;
  summary?: string;
};

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/** Accepts 2026-10-12 or 10/12/2026 (what Google Sheets exports by default). */
function normalizeDate(raw: string): string | null {
  const value = raw.trim();

  let year: number, month: number, day: number;
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (iso) {
    [year, month, day] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
  } else if (us) {
    [year, month, day] = [Number(us[3]), Number(us[1]), Number(us[2])];
  } else {
    return null;
  }

  // Reject impossible dates like 2/30 or 13/45.
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * The sheet is edited by humans, so only accept genuine "Publish to web"
 * Google Doc links before putting one in an iframe.
 */
function parseDocUrl(raw: string): { embedUrl: string; docUrl: string } | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  const isPublishedDoc =
    url.protocol === 'https:' &&
    url.hostname === 'docs.google.com' &&
    url.pathname.startsWith('/document/') &&
    url.pathname.endsWith('/pub');
  if (!isPublishedDoc) return null;

  url.search = '';
  url.hash = '';
  const docUrl = url.toString();
  url.searchParams.set('embedded', 'true');
  return { embedUrl: url.toString(), docUrl };
}

export function formatNewsletterDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Reads the newsletter index: a Google Sheet published to the web as CSV,
 * with columns `date`, `title`, `url` and optionally `summary`. Newest first.
 * Returns [] if it isn't configured or can't be fetched.
 */
export async function getNewsletters(): Promise<Newsletter[]> {
  const csvUrl = process.env.NEWSLETTERS_CSV_URL;
  if (!csvUrl) {
    console.error('NEWSLETTERS_CSV_URL is not set');
    return [];
  }

  const res = await fetch(csvUrl, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.error('Newsletter sheet request failed', res.status);
    return [];
  }

  const [header, ...rows] = parseCsv(await res.text());
  if (!header) return [];

  const column = (name: string) =>
    header.findIndex((h) => h.trim().toLowerCase() === name);
  const [dateCol, titleCol, urlCol, summaryCol] = [
    'date',
    'title',
    'url',
    'summary',
  ].map(column);
  if (dateCol < 0 || urlCol < 0) {
    console.error('Newsletter sheet needs "date" and "url" columns');
    return [];
  }

  const items = rows.flatMap((row) => {
    const date = normalizeDate(row[dateCol] ?? '');
    const doc = parseDocUrl(row[urlCol] ?? '');
    if (!date || !doc) {
      // Ignore blank rows quietly; flag half-filled ones.
      if (row.some((cell) => cell.trim())) {
        console.warn('Skipping invalid newsletter row:', row);
      }
      return [];
    }
    const title = titleCol >= 0 ? row[titleCol]?.trim() : '';
    const summary = summaryCol >= 0 ? row[summaryCol]?.trim() : '';
    return [
      {
        date,
        title: title || `Newsletter, ${formatNewsletterDate(date)}`,
        summary: summary || undefined,
        ...doc,
      },
    ];
  });

  items.sort((a, b) => b.date.localeCompare(a.date));

  const seen = new Map<string, number>();
  return items.map((item) => {
    const count = (seen.get(item.date) ?? 0) + 1;
    seen.set(item.date, count);
    return { ...item, slug: count === 1 ? item.date : `${item.date}-${count}` };
  });
}
