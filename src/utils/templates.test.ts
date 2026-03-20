import { describe, it, expect } from 'vitest';
import { TEMPLATES } from './templates';

describe('TEMPLATES', () => {
  it('contains exactly 3 entries', () => {
    expect(TEMPLATES).toHaveLength(3);
  });

  it('has unique ids', () => {
    const ids = TEMPLATES.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('contains ids: dark, white, thumb', () => {
    const ids = TEMPLATES.map((t) => t.id);
    expect(ids).toContain('dark');
    expect(ids).toContain('white');
    expect(ids).toContain('thumb');
  });

  it('each template has required fields: id, name, render', () => {
    for (const template of TEMPLATES) {
      expect(typeof template.id).toBe('string');
      expect(template.id.length).toBeGreaterThan(0);
      expect(typeof template.name).toBe('string');
      expect(template.name.length).toBeGreaterThan(0);
      expect(typeof template.render).toBe('function');
    }
  });
});
