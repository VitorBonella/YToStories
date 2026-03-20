export function extractVideoId(url: string): string | null {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const hostname = parsed.hostname.replace(/^www\./, '');

  if (hostname === 'youtu.be') {
    const id = parsed.pathname.slice(1);
    return id || null;
  }

  if (hostname === 'youtube.com') {
    if (parsed.pathname.startsWith('/shorts/')) {
      const id = parsed.pathname.slice('/shorts/'.length).split('/')[0];
      return id || null;
    }
    const id = parsed.searchParams.get('v');
    return id || null;
  }

  return null;
}
