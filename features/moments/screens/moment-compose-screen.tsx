"use client"

import { ComposerFrame } from "@/features/snaccs/components/composer/composer-frame"
import { ComposerHeader } from "@/features/snaccs/components/composer/composer-header"
import { MomentComposeBar } from "../components/composer/moment-compose-bar"
import { MomentInput } from "../components/composer/moment-input"
import { MomentPostButton } from "../components/composer/moment-post-button"
import { MomentTextCanvas } from "../components/composer/moment-text-canvas"
import { MomentTextShell } from "../components/composer/moment-text-shell"
import { useMomentComposeScreen } from "../hooks/use-moment-compose-screen"

export function MomentComposeScreen() {
  const { close, composer, pickMode } = useMomentComposeScreen()

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
      action={
        <MomentPostButton
          disabled={!composer.canPost}
          loading={composer.posting}
          onPress={composer.post}
        />
      }
    />
  )

  if (composer.mode === "text") {
    return (
      <MomentTextShell
        background={composer.background}
        onClose={close}
        bar={bar}
      >
        <MomentTextCanvas value={composer.body} onChange={composer.setBody} />
      </MomentTextShell>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col md:min-h-0">
      <ComposerHeader title="New moment" onClose={close} />

      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
        <ComposerFrame
          avatarUrl={composer.avatarUrl}
          username={composer.username}
        >
          <MomentInput
            value={composer.body}
            onChange={composer.setBody}
            placeholder="Add a caption"
          />
        </ComposerFrame>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:static">
        {bar}
      </div>
    </div>
  )
}
