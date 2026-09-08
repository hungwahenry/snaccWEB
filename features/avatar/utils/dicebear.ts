export function buildAvatarUrl(
  base: string,
  style: string,
  format: string,
  seed: string
): string {
  return `${base}/${style}/${format}?seed=${encodeURIComponent(seed)}`
}
