type PlaybackHandle = { pause: () => void }

let playing: PlaybackHandle | null = null

export function claimPlayback(handle: PlaybackHandle): void {
  if (playing && playing !== handle) playing.pause()
  playing = handle
}

export function releasePlayback(handle: PlaybackHandle): void {
  if (playing === handle) playing = null
}
