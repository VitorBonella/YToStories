import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchOEmbed } from './oembed';

const mockOEmbedResponse = {
  title: 'Test Video Title',
  author_name: 'Test Channel',
  thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchOEmbed', () => {
  it('returns OEmbedData on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOEmbedResponse),
    }));

    const result = await fetchOEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result.title).toBe('Test Video Title');
    expect(result.author_name).toBe('Test Channel');
    expect(result.thumbnail_url).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
  });

  it('throws on 404 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }));

    await expect(fetchOEmbed('https://www.youtube.com/watch?v=invalid')).rejects.toThrow('404');
  });

  it('throws on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')));

    await expect(fetchOEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).rejects.toThrow('Network error');
  });
});
