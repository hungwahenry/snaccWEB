"use client"

import { MessageSquareDashedIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useBack } from "@/hooks/use-back"
import { SnaccCardSkeleton } from "../components/card/snacc-card-skeleton"
import { ComposerAttachments } from "../components/composer/composer-attachments"
import { ComposerFrame } from "../components/composer/composer-frame"
import { ComposerHeader } from "../components/composer/composer-header"
import { ComposerInput } from "../components/composer/composer-input"
import { ComposerToolbar } from "../components/composer/composer-toolbar"
import { ImageEditorSheet } from "@/features/image-editor/components/image-editor-sheet"
import { useSnaccEditor } from "../hooks/composer/use-snacc-editor"
import { useSnacc } from "../hooks/use-snacc"
import type { Snacc } from "../types"

export function EditSnaccScreen({ id }: { id: string }) {
  const back = useBack()
  const snacc = useSnacc(id)

  if (snacc.data) return <Editor snacc={snacc.data} />

  return (
    <>
      <ComposerHeader title="Edit snacc" onClose={back} />
      {snacc.isError ? (
        <EmptyState
          icon={MessageSquareDashedIcon}
          title="This snacc isn't available"
          description="It may have been deleted."
          className="py-24"
        />
      ) : (
        <SnaccCardSkeleton />
      )}
    </>
  )
}

function Editor({ snacc }: { snacc: Snacc }) {
  const editor = useSnaccEditor(snacc)

  return (
    <div className="flex min-h-dvh flex-col">
      <ComposerHeader title="Edit snacc" onClose={editor.close} />

      <div className="flex-1 px-4 pt-4 pb-6">
        <ComposerFrame
          avatarUrl={snacc.anonymous ? null : snacc.author.avatar_url}
          username={snacc.author.username}
          ghost={snacc.anonymous}
        >
          <ComposerInput
            value={editor.body}
            onChange={editor.setBody}
            onCursorChange={editor.setCursor}
            placeholder={snacc.voice ? "Add a caption" : "Say something"}
          />
        </ComposerFrame>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border bg-background">
        <ComposerAttachments
          images={editor.images}
          gif={editor.gif}
          storedVoice={editor.storedVoice}
          onRemoveImage={editor.removeImage}
          onEditImage={editor.editImage}
          onRemoveGif={editor.removeGif}
        />
        <ComposerToolbar
          canAddImages={editor.canAddImages}
          onAddImages={editor.addImages}
          showPoll={false}
          pollActive={false}
          canStartPoll={false}
          onTogglePoll={() => {}}
          showSpoiler={editor.hasMedia}
          spoiler={editor.spoiler}
          onToggleSpoiler={editor.toggleSpoiler}
          remaining={editor.remaining}
          showCounter={editor.showCounter}
          right={
            <Button
              size="sm"
              className="h-10 px-5 font-extrabold"
              disabled={!editor.canSave}
              onClick={editor.submit}
            >
              {editor.saving ? <Spinner /> : "Save"}
            </Button>
          }
        />
      </div>
      <ImageEditorSheet {...editor.imageEditor} />
    </div>
  )
}
