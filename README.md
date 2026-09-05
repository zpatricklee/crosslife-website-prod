# Crosslife Christian Fellowship

The Crosslife Christian Fellowship website — built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com), deployed on [Vercel](https://vercel.com).

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in YOUTUBE_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable          | Purpose                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `YOUTUBE_API_KEY` | Server-only key used to pull recent sermons from the YouTube Data API for the `/sermons` page. Never exposed to the browser. |

Get/rotate a key at the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (enable the "YouTube Data API v3").

## Deploying to Vercel

1. Push this repo to GitHub (already done, `main` branch).
2. In the [Vercel dashboard](https://vercel.com/new), import the repo. Framework preset "Next.js" is auto-detected — no build config needed.
3. Add the `YOUTUBE_API_KEY` environment variable under Project Settings → Environment Variables (Production, Preview, and Development).
4. Deploy. Vercel builds and hosts every push to `main` automatically, with preview deployments for pull requests.

### Pointing crosslifegpc.com at Vercel

1. In the Vercel project, go to Settings → Domains and add `www.crosslifegpc.com` (and `crosslifegpc.com` if you want the apex to redirect to `www`).
2. Vercel will show the DNS records to add. At your domain registrar/DNS provider, update the `CNAME` (for `www`) and/or `A`/`ALIAS` record (for the apex) to match what Vercel shows.
3. Once DNS propagates, remove the old custom domain binding in the Azure Static Web App so the two don't fight over the same hostname, and you can retire/delete the Azure resource.
4. The old `.github/workflows/azure-static-web-apps-*.yml` file has been removed from this repo since Vercel's GitHub integration replaces it — no GitHub Actions config is needed.

## Project structure

- `app/` — pages and layout (Next.js App Router)
- `components/` — shared UI (header, footer, page hero)
- `lib/sermons.ts` — server-side YouTube fetch for the sermons page
- `public/` — static images
- `legacy-static-site/` — the previous plain HTML/CSS/JS site, kept for reference; safe to delete once you're happy with the new site
