import { useState } from 'react';
import type { StoryData } from '../types';
import { fetchOEmbed } from '../utils/oembed';
import { extractVideoId } from '../utils/youtube';
import { TEMPLATES } from '../utils/templates';

interface UseStoryBuilderReturn {
  videoUrl: string;
  storyData: StoryData | null;
  selectedTemplateId: string;
  isLoading: boolean;
  error: string | null;
  handleSubmit: (url: string) => Promise<void>;
  handleTemplateChange: (templateId: string) => void;
}

export function useStoryBuilder(): UseStoryBuilderReturn {
  const [videoUrl, setVideoUrl] = useState('');
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(url: string) {
    setVideoUrl(url);
    setIsLoading(true);
    setError(null);
    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      const oembed = await fetchOEmbed(url);
      setStoryData({
        title: oembed.title,
        channelName: oembed.author_name,
        thumbnailUrl: oembed.thumbnail_url,
        videoId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video data');
    } finally {
      setIsLoading(false);
    }
  }

  function handleTemplateChange(templateId: string) {
    setSelectedTemplateId(templateId);
  }

  return {
    videoUrl,
    storyData,
    selectedTemplateId,
    isLoading,
    error,
    handleSubmit,
    handleTemplateChange,
  };
}
