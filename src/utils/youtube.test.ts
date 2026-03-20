import { describe, it, expect } from 'vitest';
import { extractVideoId } from './youtube';

describe('extractVideoId', () => {
  it('extracts ID from youtube.com/watch?v=ID', () => {
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from youtu.be/ID', () => {
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from youtube.com/shorts/ID', () => {
    expect(extractVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('returns null for an empty string', () => {
    expect(extractVideoId('')).toBeNull();
  });

  it('returns null for a non-YouTube URL', () => {
    expect(extractVideoId('https://vimeo.com/123456')).toBeNull();
  });

  it('returns null for a malformed URL', () => {
    expect(extractVideoId('not a url')).toBeNull();
  });
});
