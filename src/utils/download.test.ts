import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadCanvas } from './download';

describe('downloadCanvas', () => {
  let canvas: HTMLCanvasElement;
  let mockAnchor: { href: string; download: string; click: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.restoreAllMocks();

    canvas = {
      toDataURL: vi.fn((mimeType: string, quality?: number) => {
        if (mimeType === 'image/jpeg') return `data:image/jpeg;base64,jpeg-${quality}`;
        return 'data:image/png;base64,png-data';
      }),
    } as unknown as HTMLCanvasElement;

    mockAnchor = { href: '', download: '', click: vi.fn(), remove: vi.fn() };
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);
  });

  it('calls toDataURL with image/png for png format', () => {
    downloadCanvas(canvas, 'png', 'story.png');
    expect(canvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('calls toDataURL with image/jpeg and 0.92 quality for jpeg format', () => {
    downloadCanvas(canvas, 'jpeg', 'story.jpeg');
    expect(canvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.92);
  });

  it('sets correct href and download attributes then clicks and removes for png', () => {
    downloadCanvas(canvas, 'png', 'my-story.png');
    expect(mockAnchor.href).toBe('data:image/png;base64,png-data');
    expect(mockAnchor.download).toBe('my-story.png');
    expect(mockAnchor.click).toHaveBeenCalledOnce();
    expect(mockAnchor.remove).toHaveBeenCalledOnce();
  });

  it('sets correct href and download attributes then clicks and removes for jpeg', () => {
    downloadCanvas(canvas, 'jpeg', 'my-story.jpeg');
    expect(mockAnchor.href).toBe('data:image/jpeg;base64,jpeg-0.92');
    expect(mockAnchor.download).toBe('my-story.jpeg');
    expect(mockAnchor.click).toHaveBeenCalledOnce();
    expect(mockAnchor.remove).toHaveBeenCalledOnce();
  });
});
