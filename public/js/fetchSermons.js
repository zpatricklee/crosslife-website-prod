const API_KEY = 'AIzaSyDgb7Cl1QVhVt54Xt8b48EX-bEH7mQiWGA';
const CHANNEL_ID = 'UC9cqKtDJQFvr_0Yq09RLJRw';
const MAX_RESULTS = 50; // Fetch more to allow for filtering

async function fetchSermons() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}&type=video`;
  const res = await fetch(url);
  const data = await res.json();

  // Get video IDs
  const videoIds = data.items.map((item) => item.id.videoId).join(',');

  // Fetch video details for durations
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=contentDetails,snippet`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  // Filter and display

  const sermons = detailsData.items
    .filter((item) => {
      // Convert ISO 8601 duration to seconds
      const match = item.contentDetails.duration.match(
        /PT(\d+H)?(\d+M)?(\d+S)?/,
      );
      const hours = match && match[1] ? parseInt(match[1]) : 0;
      const minutes = match && match[2] ? parseInt(match[2]) : 0;
      const seconds = match && match[3] ? parseInt(match[3]) : 0;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      const title = item.snippet.title || '';
      const isSermon = title.trim().toLowerCase().startsWith('sermon');

      console.log(
        `Video: ${title}, Duration: ${totalSeconds} seconds, isSermon: ${isSermon}`,
      );

      return totalSeconds >= 180 && isSermon;
    })
    .slice(0, 5);

  // Render
  const container = document.getElementById('sermons-list');
  container.innerHTML = sermons
    .map(
      (video) => `
    <div>
      <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">
        <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
        <p>${video.snippet.title}</p>
      </a>
    </div>
  `,
    )
    .join('');
}

fetchSermons();
