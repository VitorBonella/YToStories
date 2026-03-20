import { render, screen, act } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import { StoryPreview } from './StoryPreview';
import type { StoryData } from '../../types';

vi.mock('../../utils/renderer', () => ({
  renderTemplate: vi.fn().mockResolvedValue(undefined),
}));

import { renderTemplate } from '../../utils/renderer';

const mockRenderTemplate = vi.mocked(renderTemplate);

const mockCtx = {} as CanvasRenderingContext2D;

const storyData: StoryData = {
  title: 'Test Video',
  channelName: 'Test Channel',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  videoId: 'abc123',
};

class FakeImage {
  crossOrigin = '';
  private _src = '';
  onload: (() => void) | null = null;

  get src() {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
    // Trigger onload synchronously
    this.onload?.();
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('Image', FakeImage);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);
});

describe('StoryPreview', () => {
  it('shows placeholder when storyData is null', () => {
    render(<StoryPreview storyData={null} templateId="dark" />);
    expect(screen.getByText(/submit a youtube url/i)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders a canvas when storyData is provided', async () => {
    await act(async () => {
      render(<StoryPreview storyData={storyData} templateId="dark" />);
    });
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '1080');
    expect(canvas).toHaveAttribute('height', '1920');
  });

  it('does not show placeholder when storyData is provided', async () => {
    await act(async () => {
      render(<StoryPreview storyData={storyData} templateId="dark" />);
    });
    expect(screen.queryByText(/submit a youtube url/i)).not.toBeInTheDocument();
  });

  it('calls renderTemplate with correct templateId', async () => {
    await act(async () => {
      render(<StoryPreview storyData={storyData} templateId="white" />);
    });
    expect(mockRenderTemplate).toHaveBeenCalledWith(
      expect.anything(),
      storyData,
      'white'
    );
  });

  it('re-renders when templateId changes', async () => {
    const { rerender } = render(
      <StoryPreview storyData={storyData} templateId="dark" />
    );
    await act(async () => {});

    await act(async () => {
      rerender(<StoryPreview storyData={storyData} templateId="thumb" />);
    });

    const calls = mockRenderTemplate.mock.calls;
    const templateIds = calls.map((c) => c[2]);
    expect(templateIds).toContain('thumb');
  });

  it('sets crossOrigin to anonymous on the image', async () => {
    const images: FakeImage[] = [];
    class CapturingImage extends FakeImage {
      constructor() {
        super();
        images.push(this);
      }
    }
    vi.stubGlobal('Image', CapturingImage);

    await act(async () => {
      render(<StoryPreview storyData={storyData} templateId="dark" />);
    });

    expect(images.length).toBeGreaterThan(0);
    expect(images[0].crossOrigin).toBe('anonymous');
  });
});
