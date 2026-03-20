import type { StoryData } from '../types';
import { TEMPLATES } from './templates';

export async function renderTemplate(
  ctx: CanvasRenderingContext2D,
  data: StoryData,
  templateId: string
): Promise<void> {
  const template = TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Unknown template id: ${templateId}`);
  }
  await template.render(ctx, data);
}
