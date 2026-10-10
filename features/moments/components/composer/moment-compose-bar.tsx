import type { ComponentProps, ReactNode } from "react"
import { ComposerProblem } from "@/features/snaccs/components/composer/composer-problem"
import { ComposerSuggestions } from "@/features/snaccs/components/composer/composer-suggestions"
import type { PickedImage } from "@/lib/media"
import type { ChosenMode, MomentMode } from "../../types"
import type { MomentLengthChip } from "../../hooks/use-moment-length"
import { MomentAttachment } from "./moment-attachment"
import { MomentBackgroundRow } from "./moment-background-row"
import { MomentToolbar } from "./moment-toolbar"

type MomentComposeBarProps = {
  mode: MomentMode
  onModeChange: (mode: ChosenMode) => void
  background: string
  onBackgroundChange: (background: string) => void
  image: PickedImage | null
  onRemoveImage: () => void
  remaining: number
  problem: string | null
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
  problem,
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

      <ComposerProblem problem={problem} />

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
