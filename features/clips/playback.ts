import { voicePlayer } from "@/features/voice/hooks/use-voice-player"

export const FAST_RATE = 2

export interface WantedPlayback {
  play: boolean
  muted: boolean
  rate: number
}

type Playable = Pick<
  HTMLVideoElement,
  "muted" | "paused" | "playbackRate" | "play" | "pause"
>

let sounding: HTMLVideoElement | null = null

export function claimSound(video: HTMLVideoElement): void {
  if (sounding && sounding !== video) sounding.pause()
  sounding = video
  voicePlayer.pause()
}

export function releaseSound(video: HTMLVideoElement): void {
  if (sounding === video) sounding = null
}

export function isSoundBlocked(error: unknown): boolean {
  return error instanceof DOMException && error.name === "NotAllowedError"
}

export function driveVideo(
  video: Playable,
  wanted: WantedPlayback,
  onBlocked: () => void
): void {
  video.muted = wanted.muted

  if (!wanted.play) {
    video.pause()
    return
  }

  if (video.playbackRate !== wanted.rate) video.playbackRate = wanted.rate
  if (!video.paused) return

  void video.play().catch((error: unknown) => {
    if (!wanted.muted && isSoundBlocked(error)) onBlocked()
  })
}

export function muteVideo(video: HTMLVideoElement, muted: boolean): void {
  video.muted = muted
}

export function seekVideo(video: HTMLVideoElement, ms: number): void {
  video.currentTime = ms / 1000
}
