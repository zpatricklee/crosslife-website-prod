import sanitizeHtml from 'sanitize-html';

/**
 * Turns a "Publish to web" Google Doc into a standalone HTML page that we can
 * show in a script-free, same-origin iframe (via srcDoc). Unlike Google's own
 * embed (a fixed-width page that gets cropped on phones), this one reflows to
 * whatever width it's shown at, and its height can follow its content.
 *
 * Returns null if the Doc isn't in the shape we expect, so the caller can fall
 * back to Google's embed instead of showing something broken.
 */

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

/** Only stylesheet imports from these hosts (the Doc's fonts) are kept. */
const FONT_HOSTS = new Set(['themes.googleusercontent.com', 'fonts.googleapis.com']);

export const IMAGE_PROXY_PATH = '/api/newsletter-image';

/** Google blocks other sites from loading its Doc images directly, so they go through our relay. */
export function isDocImageUrl(url: URL): boolean {
  return (
    url.protocol === 'https:' &&
    url.hostname === 'docs.google.com' &&
    url.pathname.startsWith('/docs-images-rt/')
  );
}

function proxiedImage(src: string): string | null {
  try {
    const url = new URL(src);
    if (!isDocImageUrl(url)) return null;
    return `${IMAGE_PROXY_PATH}?u=${encodeURIComponent(url.toString())}`;
  } catch {
    return null;
  }
}

/** Google wraps outbound links as https://www.google.com/url?q=<real url>; unwrap them. */
function cleanHref(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.hostname.endsWith('google.com') && url.pathname === '/url') {
      const target = url.searchParams.get('q');
      return target ? cleanHref(target) : null;
    }
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Keeps the Doc's own styling, minus anything that could fetch or run something. */
function cleanCss(css: string): { css: string; fontLinks: string[] } {
  const fontLinks: string[] = [];
  const withoutImports = css.replace(
    /@import\s+(?:url\(\s*)?['"]?([^'")\s;]+)['"]?\s*\)?[^;]*;/gi,
    (_, href: string) => {
      try {
        const url = new URL(href);
        if (url.protocol === 'https:' && FONT_HOSTS.has(url.hostname)) {
          fontLinks.push(url.toString());
        }
      } catch {
        // not a usable URL: drop it
      }
      return '';
    },
  );

  const safe = withoutImports
    // Docs lets paragraphs hang into the page margin with a negative indent. We
    // replace the page margin with our own padding, so that would push text
    // off the edge of the screen.
    .replace(/(margin-(?:left|right))\s*:\s*-[\d.]+(?:pt|px|em|rem|%)/gi, '$1:0')
    .replace(/<\/?style/gi, '')
    .replace(/url\s*\([^)]*\)/gi, 'none')
    .replace(/expression\s*\(/gi, '(')
    .replace(/javascript:/gi, '');
  return { css: safe, fontLinks };
}

// Reflow the Doc to the width it's shown at, instead of Google's fixed 8.5in page.
const LAYOUT_CSS = `
  html, body { margin: 0; background: transparent; }
  body { overflow-wrap: break-word; -webkit-text-size-adjust: 100%; }
  .doc-content { max-width: none !important; background: transparent !important;
    padding: 40px 48px !important; box-sizing: border-box; }
  @media (max-width: 600px) {
    .doc-content { padding: 24px 18px !important; }
    /* The Doc's 36pt/18pt title styles are wider than a phone. */
    .title { font-size: 2.1rem !important; }
    .subtitle { font-size: 1.2rem !important; }
  }
  img { display: block; height: auto; max-width: 100%; }
  table { display: block; max-width: 100%; overflow-x: auto; }
  a { overflow-wrap: anywhere; }
`;

export async function getNewsletterDoc(docUrl: string): Promise<string | null> {
  let html: string;
  try {
    const res = await fetch(`${docUrl}?embedded=true`, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  // The embedded page is: <head>…</head> <style>doc css</style> <div class="… doc-content">…</div> <script>…
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  const contentStart = html.search(/<div[^>]*class="[^"]*\bdoc-content\b/i);
  if (styles.length === 0 || contentStart < 0) return null;

  const contentEnd = html.indexOf('<script', contentStart);
  const rawContent = html.slice(contentStart, contentEnd < 0 ? undefined : contentEnd);

  const body = sanitizeHtml(rawContent, {
    allowedTags: [
      'div', 'span', 'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'b', 'strong', 'i', 'em', 'u', 'sup', 'sub',
      'blockquote', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
    ],
    allowedAttributes: {
      '*': ['class', 'id'],
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'style'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ? cleanHref(attribs.href) : null;
        return {
          tagName,
          attribs: href
            ? { ...attribs, href, target: '_blank', rel: 'noopener noreferrer' }
            : { ...attribs, href: '' },
        };
      },
      img: (tagName, attribs) => {
        const src = attribs.src ? proxiedImage(attribs.src) : null;
        // The Doc sizes images in px; keep that as a ceiling but let them shrink to fit.
        const width = parseFloat(/width:\s*([\d.]+)px/.exec(attribs.style ?? '')?.[1] ?? '');
        return {
          tagName,
          attribs: {
            src: src ?? '',
            alt: attribs.alt ?? '',
            ...(Number.isFinite(width) && width > 0
              ? { style: `width:min(100%,${Math.round(width)}px);height:auto` }
              : {}),
          },
        };
      },
    },
    // Drop images we couldn't map to our relay rather than leave a broken link.
    exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
  });

  // Nothing readable came out: let the caller fall back to Google's embed.
  if (sanitizeHtml(body, { allowedTags: [] }).trim().length < 20) return null;

  const { css, fontLinks } = cleanCss(styles.map((match) => match[1]).join('\n'));
  const fontTags = fontLinks
    .map((href) => `<link rel="stylesheet" href="${href.replace(/"/g, '%22')}">`)
    .join('');

  return (
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<base target="_blank">${fontTags}<style>${css}</style><style>${LAYOUT_CSS}</style>` +
    `</head><body>${body}</body></html>`
  );
}
