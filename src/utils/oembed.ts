import type { OEmbedData } from '../types';

export async function fetchOEmbed(videoUrl: string): Promise<OEmbedData> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

  let response: Response;
  try {
    response = await fetch(endpoint);
  } catch (err) {
    throw new Error(`Network error fetching oEmbed data: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!response.ok) {
    throw new Error(`oEmbed request failed with status ${response.status}`);
  }

  const data = await response.json();
  return {
    title: data.title,
    author_name: data.author_name,
    thumbnail_url: data.thumbnail_url,
  };
}
