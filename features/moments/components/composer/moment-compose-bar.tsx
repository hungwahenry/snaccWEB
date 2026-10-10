import type { ComponentProps, ReactNode } from "react"
import { ComposerSuggestions } from "@/features/snaccs/components/composer/composer-suggestions"
import type { PickedImage } from "@/lib/media"
import type { MomentMode } from "../../types"
import type { MomentLengthChip } from "../../hooks/use-moment-length"
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
  length: MomentLengthChip | null
  suggestions: ComponentProps<typeof ComposerSuggestions> | null
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
  length,
  suggestions,
  action,
}: MomentComposeBarProps) {
  return (
    <>
      {suggestions ? (
        <ComposerSuggestions {...suggestions} />
      ) : mode !== "image" ? (
        <MomentBackgroundRow value={background} onChange={onBackgroundChange} />
      ) : (
        <MomentAttachment image={image} onRemove={onRemoveImage} />
      )}

      <MomentToolbar
        mode={mode}
        onModeChange={onModeChange}
        remaining={remaining}
        showCounter={showCounter}
        length={length}
        right={action}
      />
    </>
  )
}
