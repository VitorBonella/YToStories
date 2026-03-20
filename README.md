# YToStories

A frontend-only tool that converts a YouTube URL into a downloadable 1080×1920 Instagram Story image. Uses the YouTube oEmbed API (no API key required) and the Canvas API to render the image in three visual templates.

## Overview

Paste a YouTube URL → choose a template → preview the Story → download as PNG or JPEG.

All processing happens in the browser. No server required.

## Prerequisites

- Node.js ≥ 18 (developed on v24)
- npm ≥ 9

## Getting started

```bash
npm install
```

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run test` | Run all unit tests |
| `npm run coverage` | Run tests with coverage report |

## Public utility API

### `extractVideoId(url: string): string | null`

Parses a YouTube URL and returns the video ID, or `null` if the URL is not a recognised YouTube URL.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `url` | `string` | Any string — full YouTube URL or arbitrary input |

**Returns** `string | null` — the video ID on success, `null` otherwise.

**Supported formats**

```ts
extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
extractVideoId('https://youtu.be/dQw4w9WgXcQ')               // 'dQw4w9WgXcQ'
extractVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
extractVideoId('https://example.com')                          // null
extractVideoId('')                                             // null
```

---

### `fetchOEmbed(videoUrl: string): Promise<OEmbedData>`

Fetches video metadata from the YouTube oEmbed endpoint. No API key needed.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `videoUrl` | `string` | Full YouTube video URL (e.g. `https://www.youtube.com/watch?v=…`) |

**Returns** `Promise<OEmbedData>` — resolves with `{ title, author_name, thumbnail_url }`.

**Throws** an `Error` on non-200 HTTP responses or network failures.

**Example**

```ts
import { fetchOEmbed } from './src/utils/oembed';

const data = await fetchOEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// { title: 'Rick Astley - Never Gonna Give You Up', author_name: 'RickAstleyVEVO', thumbnail_url: '...' }
```

---

### `renderTemplate(ctx: CanvasRenderingContext2D, data: StoryData, templateId: string): Promise<void>`

Renders a Story template onto a canvas context.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ctx` | `CanvasRenderingContext2D` | 2D context of a 1080×1920 canvas |
| `data` | `StoryData` | `{ title, channelName, thumbnailUrl, videoId }` |
| `templateId` | `string` | One of `'dark'`, `'light'`, `'gradient'` |

**Returns** `Promise<void>` — resolves when all drawing is complete.

**Throws** an `Error` if `templateId` is not recognised.

**Example**

```ts
import { renderTemplate } from './src/utils/renderer';

const canvas = document.getElementById('preview') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
await renderTemplate(ctx, storyData, 'dark');
```

**Available templates**

| ID | Description |
|---|---|
| `dark` | Black background, thumbnail centred, title and channel name overlaid at the bottom with a semi-transparent scrim |
| `light` | White background, thumbnail in the upper half, title in dark text below, channel name in muted grey, "Watch on YouTube" CTA badge |
| `gradient` | Blurred thumbnail fills the full 9:16 frame, purple-to-black gradient overlay, title in bold white text centred |

---

### `downloadCanvas(canvas: HTMLCanvasElement, format: 'png' | 'jpeg', filename: string): void`

Converts a canvas to an image file and triggers a browser download.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `canvas` | `HTMLCanvasElement` | The canvas to export |
| `format` | `'png' \| 'jpeg'` | Output format (`jpeg` uses 0.92 quality) |
| `filename` | `string` | Suggested filename for the download (e.g. `yt-story-dQw4w9WgXcQ.png`) |

**Returns** `void`

**Example**

```ts
import { downloadCanvas } from './src/utils/download';

downloadCanvas(canvasElement, 'png', 'yt-story-dQw4w9WgXcQ.png');
downloadCanvas(canvasElement, 'jpeg', 'yt-story-dQw4w9WgXcQ.jpeg');
```

---

## CORS note

YouTube thumbnail URLs are served from `i.ytimg.com`. To draw them onto a canvas without tainting it (which would block `toDataURL`), the thumbnail `<img>` element must set `crossOrigin="anonymous"` **before** its `src` is assigned. The `StoryPreview` component and all template render functions handle this automatically.

If you embed this tool on a page served from a different origin, ensure your hosting server does not strip the `Origin` header from requests, and note that YouTube's CDN must respond with the appropriate `Access-Control-Allow-Origin` header — which it does for anonymous requests.

## Screenshot

![App screenshot](docs/screenshot.png)
