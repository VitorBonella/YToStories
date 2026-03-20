import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderTemplate } from './renderer';
import type { StoryData } from '../types';

const storyData: StoryData = {
  title: 'Test Video',
  channelName: 'Test Channel',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  videoId: 'abc123',
};

function makeCtx() {
  return {
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
    filter: '',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetY: 0,
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arcTo: vi.fn(),
    arc: vi.fn(),
    clip: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    roundRect: vi.fn(),
    fill: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
  } as unknown as CanvasRenderingContext2D;
}

// Fake Image class whose src setter immediately resolves onload
class FakeImage {
  width = 1280;
  height = 720;
  crossOrigin = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(_val: string) {
    this.onload?.();
  }

  get src() {
    return '';
  }
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal('Image', FakeImage);
});

describe('renderTemplate', () => {
  it('throws for unknown template id', async () => {
    const ctx = makeCtx();
    await expect(renderTemplate(ctx, storyData, 'nonexistent')).rejects.toThrow('Unknown template id');
  });

  it('dark template calls drawImage and fillText', async () => {
    const ctx = makeCtx();
    await renderTemplate(ctx, storyData, 'dark');
    expect(ctx.drawImage).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalled();
  });

  it('white template calls drawImage and fillText', async () => {
    const ctx = makeCtx();
    await renderTemplate(ctx, storyData, 'white');
    expect(ctx.drawImage).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalled();
  });

  it('thumb template calls drawImage and fillText', async () => {
    const ctx = makeCtx();
    await renderTemplate(ctx, storyData, 'thumb');
    expect(ctx.drawImage).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalled();
  });
});
