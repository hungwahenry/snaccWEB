export const MIN_TAKE_MS = 700

/** How far left the finger slides before letting go throws the take away. */
export const CANCEL_DISTANCE = 90

const CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
]

export function pickMimeType(
  isSupported: (type: string) => boolean
): string | undefined {
  return CANDIDATES.find(isSupported)
}

export function voiceFileName(mimeType: string): string {
  if (mimeType.includes("mp4")) return "voice.m4a"
  if (mimeType.includes("ogg")) return "voice.ogg"
  if (mimeType.includes("mpeg")) return "voice.mp3"
  return "voice.webm"
}

export function micErrorMessage(error: unknown): string {
  const denied =
    error instanceof DOMException &&
    (error.name === "NotAllowedError" || error.name === "SecurityError")

  return denied
    ? "Microphone access is off. Allow it in your browser settings."
    : "Snacc needs your microphone to record."
}

/** 0 at rest, 1 once the slide would cancel. */
export function cancelProgress(slide: number): number {
  return Math.min(1, Math.abs(slide) / CANCEL_DISTANCE)
}

export function slideCancels(slide: number): boolean {
  return slide <= -CANCEL_DISTANCE
}
