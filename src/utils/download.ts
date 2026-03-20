export function downloadCanvas(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg',
  filename: string
): void {
  const dataUrl = format === 'png'
    ? canvas.toDataURL('image/png')
    : canvas.toDataURL('image/jpeg', 0.92);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
  a.remove();
}
