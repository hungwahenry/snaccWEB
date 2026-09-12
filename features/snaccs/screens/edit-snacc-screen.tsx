"use client"

import { ComposerBar } from "@/components/ui/composer-bar"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { MessageSquareDashedIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useBack } from "@/hooks/use-back"
import { ComposerAttachments } from "../components/composer/composer-attachments"
import { ComposerFrame } from "../components/composer/composer-frame"
import { ComposerFrameSkeleton } from "../components/composer/composer-frame-skeleton"
import { ComposerHeader } from "../components/composer/composer-header"
import { ComposerInput } from "../components/composer/composer-input"
import { ComposerNudges } from "../components/composer/composer-nudges"
import { ComposerToolbar } from "../components/composer/composer-toolbar"
import { ComposerToolbarSkeleton } from "../components/composer/composer-toolbar-skeleton"
import { ImageEditorSheet } from "@/features/image-editor/components/image-editor-sheet"
import { useSnaccEditor } from "../hooks/composer/use-snacc-editor"
import { useSnacc } from "../hooks/use-snacc"
import type { Snacc } from "../types"

export function EditSnaccScreen({ id }: { id: string }) {
  const back = useBack()
  const snacc = useSnacc(id)

  if (snacc.data) return <Editor snacc={snacc.data} />

  return (
    <ComposerScreen>
      <ComposerHeader title="Edit snacc" onClose={back} />
      {snacc.isError ? (
        <EmptyState
          icon={MessageSquareDashedIcon}
          title="This snacc isn't available"
          description="It may have been deleted."
          className="py-24"
        />
      ) : (
        <>
          <div className="flex-1 px-4 pt-4 pb-6">
            <ComposerFrameSkeleton />
          </div>
          <ComposerBar>
            <ComposerToolbarSkeleton />
          </ComposerBar>
        </>
      )}
    </ComposerScreen>
  )
}

function Editor({ snacc }: { snacc: Snacc }) {
  const editor = useSnaccEditor(snacc)

  return (
    <ComposerScreen className="overflow-y-auto">
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

      <ComposerBar>
        <ComposerAttachments
          images={editor.images}
          gif={editor.gif}
          storedVoice={editor.storedVoice}
          onRemoveImage={editor.removeImage}
          onEditImage={editor.editImage}
          onRemoveGif={editor.removeGif}
        />
        <ComposerNudges body={editor.upgrade} image={editor.imageUpgrade} />
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
          upgrade={editor.upgrade}
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
      </ComposerBar>
      <ImageEditorSheet {...editor.imageEditor} />
    </ComposerScreen>
  )
}
