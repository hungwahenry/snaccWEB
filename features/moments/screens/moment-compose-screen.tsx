"use client"

import { ComposerBar } from "@/components/ui/composer-bar"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { ComposerFrame } from "@/features/snaccs/components/composer/composer-frame"
import { ComposerHeader } from "@/features/snaccs/components/composer/composer-header"
import { MomentComposeBar } from "../components/composer/moment-compose-bar"
import { MomentInput } from "../components/composer/moment-input"
import { MomentPostButton } from "../components/composer/moment-post-button"
import { MomentSnaccCanvas } from "../components/composer/moment-snacc-canvas"
import { MomentTextCanvas } from "../components/composer/moment-text-canvas"
import { MomentTextShell } from "../components/composer/moment-text-shell"
import { useMomentComposeScreen } from "../hooks/use-moment-compose-screen"

export function MomentComposeScreen({ snaccId }: { snaccId: string | null }) {
  const { close, composer, pickMode, sharing, suggestions, onKeyDown } =
    useMomentComposeScreen(snaccId)

  const bar = (
    <MomentComposeBar
      mode={composer.mode}
      onModeChange={pickMode}
      background={composer.background}
      onBackgroundChange={composer.setBackground}
      image={composer.image}
      onRemoveImage={composer.clearImage}
      remaining={composer.remaining}
      showCounter={composer.showCounter}
      length={composer.length}
      suggestions={suggestions}
      action={
        <MomentPostButton
          disabled={!composer.canPost}
          loading={composer.posting}
          onPress={composer.post}
        />
      }
    />
  )

  if (sharing) {
    return (
      <MomentTextShell
        background={composer.background}
        onClose={close}
        bar={bar}
      >
        <MomentSnaccCanvas
          snacc={sharing.snacc}
          failed={sharing.failed}
          value={composer.body}
          onChange={composer.setBody}
          onCursorChange={composer.setCursor}
          onKeyDown={onKeyDown}
        />
      </MomentTextShell>
    )
  }

  if (composer.mode === "text") {
    return (
      <MomentTextShell
        background={composer.background}
        onClose={close}
        bar={bar}
      >
        <MomentTextCanvas
          value={composer.body}
          onChange={composer.setBody}
          onCursorChange={composer.setCursor}
          onKeyDown={onKeyDown}
        />
      </MomentTextShell>
    )
  }

  return (
    <ComposerScreen className="overflow-y-auto">
      <ComposerHeader title="New moment" onClose={close} />

      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
        <ComposerFrame
          avatarUrl={composer.avatarUrl}
          username={composer.username}
        >
          <MomentInput
            value={composer.body}
            onChange={composer.setBody}
            onCursorChange={composer.setCursor}
            onKeyDown={onKeyDown}
            placeholder="Add a caption"
          />
        </ComposerFrame>
      </div>

      <ComposerBar>{bar}</ComposerBar>
    </ComposerScreen>
  )
}
