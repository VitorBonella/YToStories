import React, { useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import type { StoryData } from '../../types';
import { renderTemplate } from '../../utils/renderer';
import './StoryPreview.css';

interface StoryPreviewProps {
  storyData: StoryData | null;
  templateId: string;
  canvasRef?: RefObject<HTMLCanvasElement | null>;
}

export function StoryPreview({ storyData, templateId, canvasRef: externalRef }: StoryPreviewProps) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalRef ?? internalRef;

  useEffect(() => {
    if (!storyData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      renderTemplate(ctx, storyData, templateId).catch(() => {});
    };
    img.src = storyData.thumbnailUrl;
  }, [storyData, templateId]);

  if (!storyData) {
    return (
      <div className="story-preview story-preview--empty">
        <p className="story-preview__placeholder">Submit a YouTube URL to see a preview</p>
      </div>
    );
  }

  return (
    <div className="story-preview">
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        className="story-preview__canvas"
        width={1080}
        height={1920}
      />
    </div>
  );
}
