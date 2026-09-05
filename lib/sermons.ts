const CHANNEL_ID = 'UC9cqKtDJQFvr_0Yq09RLJRw';
const RESULTS_PER_PAGE = 50;
const MIN_DURATION_SECONDS = 180;
// How many additional YouTube pages we're willing to walk back through in a
// single "Load More" click looking for sermons, so a stretch of the channel
// history with few/no sermons doesn't cost one huge, slow request.
const MAX_PAGES_PER_FETCH = 5;

export type Sermon = {
  id: string;
  title: string;
  thumbnailUrl: string;
};

export type SermonsPage = {
  sermons: Sermon[];
  /** Pass back into fetchSermonsPage to continue further back in the channel's history. */
  nextPageToken?: string;
};

function parseDurationSeconds(iso8601Duration: string): number {
  const match = iso8601Duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = match?.[1] ? parseInt(match[1]) : 0;
  const minutes = match?.[2] ? parseInt(match[2]) : 0;
  const seconds = match?.[3] ? parseInt(match[3]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}

type VideoItem = {
  id: string;
  contentDetails: { duration: string };
  snippet: {
    title: string;
    thumbnails: { medium?: { url: string }; default?: { url: string } };
  };
};

/** Fetches one page of the channel's uploads and filters it down to sermons. */
async function fetchOnePage(
  apiKey: string,
  pageToken?: string,
): Promise<{ sermons: Sermon[]; nextPageToken?: string }> {
  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  searchUrl.searchParams.set('key', apiKey);
  searchUrl.searchParams.set('channelId', CHANNEL_ID);
  searchUrl.searchParams.set('part', 'snippet,id');
  searchUrl.searchParams.set('order', 'date');
  searchUrl.searchParams.set('maxResults', String(RESULTS_PER_PAGE));
  searchUrl.searchParams.set('type', 'video');
  if (pageToken) searchUrl.searchParams.set('pageToken', pageToken);

  const searchRes = await fetch(searchUrl, { next: { revalidate: 3600 } });
  if (!searchRes.ok) {
    console.error('YouTube search request failed', searchRes.status);
    return { sermons: [] };
  }
  const searchData = await searchRes.json();
  const nextPageToken: string | undefined = searchData.nextPageToken;
  const videoIds = (searchData.items ?? [])
    .map((item: { id: { videoId: string } }) => item.id.videoId)
    .join(',');

  if (!videoIds) return { sermons: [], nextPageToken };

  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=contentDetails,snippet`;
  const detailsRes = await fetch(detailsUrl, { next: { revalidate: 3600 } });
  if (!detailsRes.ok) {
    console.error('YouTube videos request failed', detailsRes.status);
    return { sermons: [], nextPageToken };
  }
  const detailsData = await detailsRes.json();

  const sermons = (detailsData.items ?? [])
    .filter((item: VideoItem) => {
      const seconds = parseDurationSeconds(item.contentDetails.duration);
      const isSermon = item.snippet.title
        .trim()
        .toLowerCase()
        .startsWith('sermon');
      return seconds >= MIN_DURATION_SECONDS && isSermon;
    })
    .map((item: VideoItem) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnailUrl:
        item.snippet.thumbnails.medium?.url ??
        item.snippet.thumbnails.default?.url ??
        '',
    }));

  return { sermons, nextPageToken };
}

/**
 * Fetches sermons starting from `pageToken` (omit for the most recent),
 * walking further back through the channel's history as needed until it
 * finds at least one sermon or runs out of pages/budget. This means a
 * stretch of uploads with no sermons doesn't show up as a "Load More" that
 * does nothing.
 */
export async function fetchSermonsPage(
  pageToken?: string,
): Promise<SermonsPage> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('YOUTUBE_API_KEY is not set');
    return { sermons: [] };
  }

  const collected: Sermon[] = [];
  let token = pageToken;

  for (let page = 0; page < MAX_PAGES_PER_FETCH; page++) {
    const result = await fetchOnePage(apiKey, token);
    collected.push(...result.sermons);
    token = result.nextPageToken;

    if (collected.length > 0 || !token) break;
  }

  return { sermons: collected, nextPageToken: token };
}

export async function getSermons(): Promise<SermonsPage> {
  return fetchSermonsPage();
}
