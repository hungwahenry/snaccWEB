"use client"

import { NowPlayingBar } from "../components/now-playing-bar"
import { useNowPlaying } from "../hooks/use-now-playing"

export function NowPlaying() {
  const bar = useNowPlaying()
  return bar ? <NowPlayingBar {...bar} /> : null
}
