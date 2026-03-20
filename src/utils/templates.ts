import type { Template, StoryData } from '../types';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

const darkTemplate: Template = {
  id: 'dark',
  name: 'Dark',
  async render(ctx: CanvasRenderingContext2D, data: StoryData): Promise<void> {
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Thumbnail centered
    const img = await loadImage(data.thumbnailUrl);
    const thumbW = CANVAS_WIDTH;
    const thumbH = (img.height / img.width) * CANVAS_WIDTH;
    const thumbY = (CANVAS_HEIGHT - thumbH) / 2;
    ctx.drawImage(img, 0, thumbY, thumbW, thumbH);

    // Semi-transparent scrim at bottom
    const scrimH = 400;
    const scrimY = CANVAS_HEIGHT - scrimH;
    const grad = ctx.createLinearGradient(0, scrimY, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scrimY, CANVAS_WIDTH, scrimH);

    // Channel name
    ctx.fillStyle = '#cccccc';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.channelName, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 200);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);
  },
};

const lightTemplate: Template = {
  id: 'light',
  name: 'Light',
  async render(ctx: CanvasRenderingContext2D, data: StoryData): Promise<void> {
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Thumbnail in upper half
    const img = await loadImage(data.thumbnailUrl);
    const thumbH = CANVAS_HEIGHT / 2;
    const thumbW = (img.width / img.height) * thumbH;
    const thumbX = (CANVAS_WIDTH - thumbW) / 2;
    ctx.drawImage(img, thumbX, 0, thumbW, thumbH);

    // Title in dark text below thumbnail
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 120);

    // Channel name in muted gray
    ctx.fillStyle = '#888888';
    ctx.font = '52px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.channelName, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 220);

    // "Watch on YouTube" CTA badge
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.roundRect(CANVAS_WIDTH / 2 - 200, CANVAS_HEIGHT - 250, 400, 100, 20);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Watch on YouTube', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 188);
  },
};

const gradientTemplate: Template = {
  id: 'gradient',
  name: 'Gradient',
  async render(ctx: CanvasRenderingContext2D, data: StoryData): Promise<void> {
    // Blurred thumbnail fills full 9:16 frame
    const img = await loadImage(data.thumbnailUrl);
    ctx.filter = 'blur(20px)';
    ctx.drawImage(img, -40, -40, CANVAS_WIDTH + 80, CANVAS_HEIGHT + 80);
    ctx.filter = 'none';

    // Fixed purple-to-black gradient overlay
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, 'rgba(80,0,120,0.7)');
    grad.addColorStop(1, 'rgba(0,0,0,0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title in bold white text centered
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 88px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    // Channel name below title
    ctx.fillStyle = '#dddddd';
    ctx.font = '56px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.channelName, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
  },
};

export const TEMPLATES: Template[] = [darkTemplate, lightTemplate, gradientTemplate];
