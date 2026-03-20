export interface OEmbedData {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

export interface StoryData {
  title: string;
  channelName: string;
  thumbnailUrl: string;
  videoId: string;
}

export interface Template {
  id: string;
  name: string;
  render: (ctx: CanvasRenderingContext2D, data: StoryData) => Promise<void>;
}
