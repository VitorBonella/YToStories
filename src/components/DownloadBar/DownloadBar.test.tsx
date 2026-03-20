import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { DownloadBar } from './DownloadBar';

vi.mock('../../utils/download', () => ({
  downloadCanvas: vi.fn(),
}));

import { downloadCanvas } from '../../utils/download';

const mockDownloadCanvas = vi.mocked(downloadCanvas);

describe('DownloadBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Download PNG and Download JPEG buttons', () => {
    const ref = { current: null };
    render(<DownloadBar canvasRef={ref} videoId="abc123" />);
    expect(screen.getByRole('button', { name: /download png/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download jpeg/i })).toBeInTheDocument();
  });

  it('both buttons are disabled when canvasRef.current is null', () => {
    const ref = { current: null };
    render(<DownloadBar canvasRef={ref} videoId="abc123" />);
    expect(screen.getByRole('button', { name: /download png/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /download jpeg/i })).toBeDisabled();
  });

  it('calls downloadCanvas with png format and correct filename on PNG click', () => {
    const canvas = document.createElement('canvas');
    const ref = { current: canvas };
    render(<DownloadBar canvasRef={ref} videoId="abc123" />);
    fireEvent.click(screen.getByRole('button', { name: /download png/i }));
    expect(mockDownloadCanvas).toHaveBeenCalledWith(canvas, 'png', 'yt-story-abc123.png');
  });

  it('calls downloadCanvas with jpeg format and correct filename on JPEG click', () => {
    const canvas = document.createElement('canvas');
    const ref = { current: canvas };
    render(<DownloadBar canvasRef={ref} videoId="abc123" />);
    fireEvent.click(screen.getByRole('button', { name: /download jpeg/i }));
    expect(mockDownloadCanvas).toHaveBeenCalledWith(canvas, 'jpeg', 'yt-story-abc123.jpeg');
  });
});
