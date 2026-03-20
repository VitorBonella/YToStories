import type { RefObject } from 'react';
import { downloadCanvas } from '../../utils/download';
import './DownloadBar.css';

interface DownloadBarProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  videoId: string;
}

export function DownloadBar({ canvasRef, videoId }: DownloadBarProps) {
  const disabled = !canvasRef.current;

  function handleDownloadPng() {
    if (!canvasRef.current) return;
    downloadCanvas(canvasRef.current, 'png', `yt-story-${videoId}.png`);
  }

  function handleDownloadJpeg() {
    if (!canvasRef.current) return;
    downloadCanvas(canvasRef.current, 'jpeg', `yt-story-${videoId}.jpeg`);
  }

  return (
    <div className="download-bar">
      <button
        className="download-bar__btn"
        type="button"
        disabled={disabled}
        onClick={handleDownloadPng}
      >
        Download PNG
      </button>
      <button
        className="download-bar__btn"
        type="button"
        disabled={disabled}
        onClick={handleDownloadJpeg}
      >
        Download JPEG
      </button>
    </div>
  );
}
