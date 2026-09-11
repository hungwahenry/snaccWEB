import { ChevronLeftIcon, Trash2Icon } from "lucide-react"
import { clock } from "../utils/clock"
import { cancelProgress } from "../utils/recording"
import { RecordingDot } from "./recording-dot"
import { RecordingWave } from "./recording-wave"

const WAVE_HEIGHT = 22

export function VoiceRecordingBar({
  durationMs,
  levels,
  slide,
}: {
  durationMs: number
  levels: number[]
  slide: number
}) {
  const armed = cancelProgress(slide)

  return (
    <div className="relative flex h-9 min-w-0 flex-1 items-center gap-3 pr-2 pl-1">
      <RecordingDot />

      <div
        className="flex min-w-0 flex-1 items-center gap-3"
        style={{ opacity: 1 - armed * 0.65 }}
      >
        <span className="text-sm font-bold text-foreground tabular-nums">
          {clock(durationMs)}
        </span>
        <RecordingWave levels={levels} height={WAVE_HEIGHT} />
        <span className="flex shrink-0 items-center gap-0.5">
          <ChevronLeftIcon
            className="size-3.5 text-muted-foreground"
            aria-hidden
          />
          <span className="text-xs text-muted-foreground">slide to cancel</span>
        </span>
      </div>

      <span
        aria-hidden
        className="absolute right-2 transition-[opacity,transform]"
        style={{ opacity: armed, transform: `scale(${0.85 + armed * 0.3})` }}
      >
        <Trash2Icon className="size-5 text-destructive" />
      </span>
    </div>
  )
}
