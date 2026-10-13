import type { NextRequest } from 'next/server';
import { isDocImageUrl } from '@/lib/newsletterDoc';

// Google serves Doc images with `cross-origin-resource-policy: same-site`, so a
// browser won't load them directly on our domain. This fetches them server-side
// and passes them along. It will only ever fetch published-Doc image URLs.

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_HOPS = 2;
const RASTER_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
// Google serves the image directly to browser-like clients, and redirects others.
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

/** Where a Doc image may legitimately live: the Doc host, or Google's image CDN it can redirect to. */
function isAllowedImageUrl(url: URL): boolean {
  if (isDocImageUrl(url)) return true;
  return (
    url.protocol === 'https:' &&
    /^lh\d+(-[a-z0-9]+)?\.googleusercontent\.com$/.test(url.hostname) &&
    url.pathname.startsWith('/rd-docs-images-rt/')
  );
}

export async function GET(request: NextRequest) {
  let target: URL;
  try {
    target = new URL(request.nextUrl.searchParams.get('u') ?? '');
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  if (!isDocImageUrl(target)) return new Response('Not found', { status: 404 });

  // Follow redirects by hand so every hop is checked, never the other way round.
  let upstream: Response | undefined;
  try {
    for (let hop = 0; hop <= MAX_HOPS; hop++) {
      upstream = await fetch(target, {
        redirect: 'manual',
        headers: { 'User-Agent': USER_AGENT },
      });
      const location = upstream.headers.get('location');
      if (upstream.status < 300 || upstream.status >= 400 || !location) break;

      target = new URL(location, target);
      if (!isAllowedImageUrl(target)) return new Response('Not found', { status: 404 });
    }
  } catch {
    return new Response('Bad gateway', { status: 502 });
  }
  if (!upstream?.ok || !upstream.body) return new Response('Not found', { status: 404 });

  const type = (upstream.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  if (!RASTER_TYPES.includes(type)) return new Response('Unsupported media type', { status: 415 });

  const length = Number(upstream.headers.get('content-length') ?? 0);
  if (length > MAX_BYTES) return new Response('Too large', { status: 413 });

  return new Response(upstream.body, {
    headers: {
      'Content-Type': type,
      // The URL is stable for a given picture, so let the CDN and browsers keep it.
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
}
