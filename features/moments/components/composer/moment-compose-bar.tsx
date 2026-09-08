import type { ReactNode } from "react"
import type { PickedImage } from "@/lib/media"
import type { MomentMode } from "../../types"
import { MomentAttachment } from "./moment-attachment"
import { MomentBackgroundRow } from "./moment-background-row"
import { MomentToolbar } from "./moment-toolbar"

type MomentComposeBarProps = {
  mode: MomentMode
  onModeChange: (mode: MomentMode) => void
  background: string
  onBackgroundChange: (background: string) => void
  image: PickedImage | null
  onRemoveImage: () => void
  remaining: number
  showCounter: boolean
  action: ReactNode
}

export function MomentComposeBar({
  mode,
  onModeChange,
  background,
  onBackgroundChange,
  image,
  onRemoveImage,
  remaining,
  showCounter,
  action,
}: MomentComposeBarProps) {
  return (
    <>
      {mode === "text" ? (
        <MomentBackgroundRow value={background} onChange={onBackgroundChange} />
      ) : (
        <MomentAttachment image={image} onRemove={onRemoveImage} />
      )}

      <MomentToolbar
        mode={mode}
        onModeChange={onModeChange}
        remaining={remaining}
        showCounter={showCounter}
        right={action}
      />
    </>
  )
}
