import type { Template, StoryData } from '../types';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

// Card layout
const CARD_PAD_X = 60;
const CARD_W = CANVAS_WIDTH - CARD_PAD_X * 2; // 960
const CARD_RADIUS = 24;
const THUMB_H = Math.round(CARD_W * 9 / 16); // 540 — 16:9 thumbnail

// Text layout (below thumbnail)
const TEXT_PAD = 44;
const TITLE_SIZE = 60;
const TITLE_LINE_H = 76;
const MAX_TITLE_LINES = 3;
const CHANNEL_SIZE = 44;
const TEXT_AREA_H = TEXT_PAD + MAX_TITLE_LINES * TITLE_LINE_H + 20 + CHANNEL_SIZE + TEXT_PAD;

const CARD_H = THUMB_H + TEXT_AREA_H;
const CARD_X = CARD_PAD_X;
const CARD_Y = Math.round((CANVAS_HEIGHT - CARD_H) / 2);

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Cover-fit an image into a rectangle. */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/**
 * Draw text with word-wrap. Returns the number of lines rendered.
 * Text is left-aligned; x is the left edge.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number {
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      if (lineCount >= maxLines - 1) {
        // Truncate last line with ellipsis
        let truncated = line;
        while (truncated.length > 0 && ctx.measureText(`${truncated}…`).width > maxWidth) {
          truncated = truncated.slice(0, -1);
        }
        ctx.fillText(`${truncated}…`, x, y + lineCount * lineHeight);
        return lineCount + 1;
      }
      ctx.fillText(line, x, y + lineCount * lineHeight);
      lineCount++;
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, y + lineCount * lineHeight);
    lineCount++;
  }
  return lineCount;
}

/** Clip context to the thumbnail area (rounded top corners only). */
function clipToThumb(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(CARD_X + CARD_RADIUS, CARD_Y);
  ctx.lineTo(CARD_X + CARD_W - CARD_RADIUS, CARD_Y);
  ctx.arcTo(CARD_X + CARD_W, CARD_Y, CARD_X + CARD_W, CARD_Y + CARD_RADIUS, CARD_RADIUS);
  ctx.lineTo(CARD_X + CARD_W, CARD_Y + THUMB_H);
  ctx.lineTo(CARD_X, CARD_Y + THUMB_H);
  ctx.lineTo(CARD_X, CARD_Y + CARD_RADIUS);
  ctx.arcTo(CARD_X, CARD_Y, CARD_X + CARD_RADIUS, CARD_Y, CARD_RADIUS);
  ctx.closePath();
  ctx.clip();
}

/** Draw a rounded rectangle path. */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

const TEXT_X = CARD_X + TEXT_PAD;
const TEXT_MAX_W = CARD_W - TEXT_PAD * 2;
const TITLE_Y = CARD_Y + THUMB_H + TEXT_PAD + TITLE_SIZE; // baseline of first title line

const darkTemplate: Template = {
  id: 'dark',
  name: 'Dark',
  async render(ctx: CanvasRenderingContext2D, data: StoryData): Promise<void> {
    // Background
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const img = await loadImage(data.thumbnailUrl);

    // Card shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#1e1e1e';
    roundRectPath(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, CARD_RADIUS);
    ctx.fill();
    ctx.restore();

    // Thumbnail (clipped to rounded top)
    ctx.save();
    clipToThumb(ctx);
    drawImageCover(ctx, img, CARD_X, CARD_Y, CARD_W, THUMB_H);
    ctx.restore();

    // Card text area background
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(CARD_X, CARD_Y + THUMB_H, CARD_W, TEXT_AREA_H);

    // Round bottom corners of card
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(CARD_X, CARD_Y + CARD_H - CARD_RADIUS, CARD_RADIUS, CARD_RADIUS);
    ctx.fillRect(CARD_X + CARD_W - CARD_RADIUS, CARD_Y + CARD_H - CARD_RADIUS, CARD_RADIUS, CARD_RADIUS);
    ctx.save();
    ctx.fillStyle = '#1e1e1e';
    roundRectPath(ctx, CARD_X, CARD_Y + THUMB_H, CARD_W, TEXT_AREA_H, CARD_RADIUS);
    ctx.fill();
    ctx.restore();

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${TITLE_SIZE}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const lines = wrapText(ctx, data.title, TEXT_X, TITLE_Y, TEXT_MAX_W, TITLE_LINE_H, MAX_TITLE_LINES);

    // Channel name
    ctx.fillStyle = '#aaaaaa';
    ctx.font = `${CHANNEL_SIZE}px sans-serif`;
    ctx.fillText(data.channelName, TEXT_X, TITLE_Y + lines * TITLE_LINE_H + 20);
  },
};

const whiteTemplate: Template = {
  id: 'white',
  name: 'White',
  async render(ctx: CanvasRenderingContext2D, data: StoryData): Promise<void> {
    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const img = await loadImage(data.thumbnailUrl);

    // Card shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#ffffff';
    roundRectPath(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, CARD_RADIUS);
    ctx.fill();
    ctx.restore();

    // Thumbnail (clipped to rounded top)
    ctx.save();
    clipToThumb(ctx);
    drawImageCover(ctx, img, CARD_X, CARD_Y, CARD_W, THUMB_H);
    ctx.restore();

    // Card text area background
    ctx.save();
    ctx.fillStyle = '#ffffff';
    roundRectPath(ctx, CARD_X, CARD_Y + THUMB_H, CARD_W, TEXT_AREA_H, CARD_RADIUS);
    ctx.fill();
    ctx.restore();

    // Title
    ctx.fillStyle = '#0f0f0f';
    ctx.font = `bold ${TITLE_SIZE}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const lines = wrapText(ctx, data.title, TEXT_X, TITLE_Y, TEXT_MAX_W, TITLE_LINE_H, MAX_TITLE_LINES);

    // Channel name
    ctx.fillStyle = '#606060';
    ctx.font = `${CHANNEL_SIZE}px sans-serif`;
    ctx.fillText(data.channelName, TEXT_X, TITLE_Y + lines * TITLE_LINE_H + 20);
  },
};

const thumbTemplate: Template = {
  id: 'thumb',
  name: 'Thumb',
  async render(ctx: CanvasRenderingContext2D, data: StoryData): Promise<void> {
    const img = await loadImage(data.thumbnailUrl);

    // Blurred thumbnail fills full canvas
    ctx.filter = 'blur(24px)';
    drawImageCover(ctx, img, -60, -60, CANVAS_WIDTH + 120, CANVAS_HEIGHT + 120);
    ctx.filter = 'none';

    // Dark overlay so text stays readable
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Card (semi-transparent dark)
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 40;
    ctx.fillStyle = 'rgba(18,18,18,0.92)';
    roundRectPath(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, CARD_RADIUS);
    ctx.fill();
    ctx.restore();

    // Thumbnail (clipped to rounded top)
    ctx.save();
    clipToThumb(ctx);
    drawImageCover(ctx, img, CARD_X, CARD_Y, CARD_W, THUMB_H);
    ctx.restore();

    // Text area background (continue the card)
    ctx.save();
    ctx.fillStyle = 'rgba(18,18,18,0.92)';
    roundRectPath(ctx, CARD_X, CARD_Y + THUMB_H, CARD_W, TEXT_AREA_H, CARD_RADIUS);
    ctx.fill();
    ctx.restore();

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${TITLE_SIZE}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const lines = wrapText(ctx, data.title, TEXT_X, TITLE_Y, TEXT_MAX_W, TITLE_LINE_H, MAX_TITLE_LINES);

    // Channel name
    ctx.fillStyle = '#aaaaaa';
    ctx.font = `${CHANNEL_SIZE}px sans-serif`;
    ctx.fillText(data.channelName, TEXT_X, TITLE_Y + lines * TITLE_LINE_H + 20);
  },
};

export const TEMPLATES: Template[] = [darkTemplate, whiteTemplate, thumbTemplate];
