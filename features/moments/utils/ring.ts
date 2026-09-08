function lighten(hex: string, amount = 0.45): string {
  const value = parseInt(hex.slice(1), 16)
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * amount)
  const rgb =
    (mix((value >> 16) & 255) << 16) |
    (mix((value >> 8) & 255) << 8) |
    mix(value & 255)

  return `#${rgb.toString(16).padStart(6, "0")}`
}

export function ringColors(
  color: string | null | undefined
): [string, string] | null {
  if (!color || !/^#[0-9a-f]{6}$/i.test(color)) return null

  return [color, lighten(color)]
}

export function ringGradient(sweep: [string, string]): string {
  return `linear-gradient(135deg, ${sweep[0]}, ${sweep[1]})`
}
