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

| `NEWSLETTERS_CSV_URL` | URL of the Google Sheet (published to the web as CSV) that indexes the newsletter archive. See below. |

Get/rotate a key at the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (enable the "YouTube Data API v3").

## Newsletter archive

The `/newsletters` page is driven by a Google Sheet, so adding an issue never needs a code change or deploy.

**One-time setup**
1. Create a Google Sheet with a header row: `date`, `title`, `url`, `summary` (`summary` is optional).
2. File → Share → Publish to web → choose that sheet tab and the **Comma-separated values (.csv)** format → Publish. Copy the link.
3. Set it as `NEWSLETTERS_CSV_URL` in `.env.local` and in Vercel (Project Settings → Environment Variables), then redeploy.

**Each week**
1. In the newsletter Google Doc: File → Share → Publish to web → Publish. Copy the link (it ends in `/pub`).
2. Add a row to the Sheet: the issue date (`2026-10-12` or `10/12/2026`), a title, and the link.
3. The site picks it up within about an hour (Sheets can take a few minutes to refresh the CSV, then the page re-caches hourly).

Rows with an invalid date, or a URL that isn't a published `docs.google.com/document/.../pub` link, are skipped.

**How it's displayed:** `/newsletters` opens the latest issue. On large screens the list of issues sits on the left (grouped by year) and the selected issue is shown, centered; on phones the list becomes a full-screen picker. Each issue has its own URL, `/newsletters/<date>`, and a floating arrow button returns you to the top of the issue.

The issue itself is not Google's embed (which is a fixed-width page that gets cropped on phones). The server fetches the published Doc, keeps its text, formatting and fonts, strips anything executable, and shows it in a sandboxed frame that reflows to the screen width and grows to fit, so the page scrolls as one. Pictures are fetched through `/api/newsletter-image`, because Google won't let other sites load them directly; that route only ever fetches published-Doc images. If a Doc can't be converted, the page falls back to Google's embed. The code is in `lib/newsletterDoc.ts`.

> **Privacy:** "Publish to web" makes a document readable by anyone with its link, and search engines can find it. Don't publish a version containing prayer requests or other personal details.

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
