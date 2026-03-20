import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStoryBuilder } from './useStoryBuilder';

vi.mock('../utils/oembed', () => ({
  fetchOEmbed: vi.fn(),
}));

vi.mock('../utils/youtube', () => ({
  extractVideoId: vi.fn(),
}));

vi.mock('../utils/templates', () => ({
  TEMPLATES: [{ id: 'dark', name: 'Dark', render: vi.fn() }],
}));

import { fetchOEmbed } from '../utils/oembed';
import { extractVideoId } from '../utils/youtube';

const mockFetchOEmbed = fetchOEmbed as ReturnType<typeof vi.fn>;
const mockExtractVideoId = extractVideoId as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useStoryBuilder', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useStoryBuilder());
    expect(result.current.videoUrl).toBe('');
    expect(result.current.storyData).toBeNull();
    expect(result.current.selectedTemplateId).toBe('dark');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handleTemplateChange updates selectedTemplateId', () => {
    const { result } = renderHook(() => useStoryBuilder());
    act(() => {
      result.current.handleTemplateChange('light');
    });
    expect(result.current.selectedTemplateId).toBe('light');
  });

  it('handleSubmit sets storyData on success', async () => {
    mockExtractVideoId.mockReturnValue('abc123');
    mockFetchOEmbed.mockResolvedValue({
      title: 'Test Video',
      author_name: 'Test Channel',
      thumbnail_url: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg',
    });

    const { result } = renderHook(() => useStoryBuilder());

    await act(async () => {
      await result.current.handleSubmit('https://www.youtube.com/watch?v=abc123');
    });

    expect(result.current.videoUrl).toBe('https://www.youtube.com/watch?v=abc123');
    expect(result.current.storyData).toEqual({
      title: 'Test Video',
      channelName: 'Test Channel',
      thumbnailUrl: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg',
      videoId: 'abc123',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handleSubmit sets error when extractVideoId returns null', async () => {
    mockExtractVideoId.mockReturnValue(null);

    const { result } = renderHook(() => useStoryBuilder());

    await act(async () => {
      await result.current.handleSubmit('https://not-youtube.com');
    });

    expect(result.current.error).toBe('Invalid YouTube URL');
    expect(result.current.storyData).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('handleSubmit sets error when fetchOEmbed throws', async () => {
    mockExtractVideoId.mockReturnValue('abc123');
    mockFetchOEmbed.mockRejectedValue(new Error('oEmbed request failed with status 404'));

    const { result } = renderHook(() => useStoryBuilder());

    await act(async () => {
      await result.current.handleSubmit('https://www.youtube.com/watch?v=abc123');
    });

    expect(result.current.error).toBe('oEmbed request failed with status 404');
    expect(result.current.storyData).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('handleSubmit sets isLoading true during fetch', async () => {
    mockExtractVideoId.mockReturnValue('abc123');
    let resolveOEmbed!: (v: unknown) => void;
    mockFetchOEmbed.mockReturnValue(new Promise((res) => { resolveOEmbed = res; }));

    const { result } = renderHook(() => useStoryBuilder());

    act(() => {
      result.current.handleSubmit('https://www.youtube.com/watch?v=abc123');
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveOEmbed({
        title: 'T',
        author_name: 'C',
        thumbnail_url: 'https://img.youtube.com/vi/abc123/default.jpg',
      });
    });

    expect(result.current.isLoading).toBe(false);
  });
});
