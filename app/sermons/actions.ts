'use server';

import { fetchSermonsPage, type SermonsPage } from '@/lib/sermons';

/** Called from the client to walk further back through the channel's history. */
export async function loadMoreSermons(pageToken: string): Promise<SermonsPage> {
  return fetchSermonsPage(pageToken);
}
