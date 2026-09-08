export function editorFont(size: number): string {
  return `800 ${size}px var(--font-sans), system-ui, -apple-system, "Segoe UI", sans-serif`
}

let scratch: CanvasRenderingContext2D | null = null

/// Text width in the editor's font, for wrapping and hit-testing. Runs on one hidden canvas.
export function measureLine(line: string, size: number): number {
  if (!scratch) scratch = document.createElement("canvas").getContext("2d")
  if (!scratch) return line.length * size * 0.5
  scratch.font = editorFont(size)
  return scratch.measureText(line).width
}
