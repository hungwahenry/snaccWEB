"use client"

import { ComposerBar } from "@/components/ui/composer-bar"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { FileTextIcon, GhostIcon } from "lucide-react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ImageEditorSheet } from "@/features/image-editor/components/image-editor-sheet"
import { StickerCreator } from "@/features/stickers/components/sticker-creator"
import { StickerTraySheet } from "@/features/stickers/components/sticker-tray-sheet"
import { cn } from "@/lib/utils"
import { hydrateDrafts, useDrafts } from "../drafts/store"
import { QuoteCurve } from "../components/card/quote/quote-connector"
import { QuotedSnacc } from "../components/card/quote/quoted-snacc"
import { ComposerAttachments } from "../components/composer/composer-attachments"
import { ComposerFrame } from "../components/composer/composer-frame"
import { ComposerHeader } from "../components/composer/composer-header"
import { ComposerInput } from "../components/composer/composer-input"
import { ComposerSuggestions } from "../components/composer/composer-suggestions"
import { liveMatchCard } from "@/features/football/utils/card"
import { ComposerNudges } from "../components/composer/composer-nudges"
import { ComposerToolbar } from "../components/composer/composer-toolbar"
import { DraftsSheet } from "../components/composer/drafts-sheet"
import { PollEditor } from "../components/composer/poll-editor"
import { ReplyTo } from "../components/composer/reply-to"
import { useComposer, type ComposerMode } from "../hooks/composer/use-composer"
import { useSnacc } from "../hooks/use-snacc"

const COPY: Record<ComposerMode, { title: string; placeholder: string }> = {
  reply: { title: "Reply", placeholder: "Say something about this snacc" },
  quote: { title: "Quote", placeholder: "Add something to this" },
  new: { title: "New snacc", placeholder: "What's happening on campus?" },
}

type ComposeScreenProps = {
  parentId?: string
  resnaccOfId?: string
  initialBody?: string
  matchId?: string
  draftId?: string
}

export function ComposeScreen(props: ComposeScreenProps) {
  const { hydrated } = useDrafts()

  useEffect(() => {
    void hydrateDrafts()
  }, [])

  if (props.draftId && !hydrated) return null
  return <ComposeBody {...props} />
}

function ComposeBody({
  parentId,
  resnaccOfId,
  initialBody,
  matchId,
  draftId,
}: ComposeScreenProps) {
  const composer = useComposer({
    parentId,
    resnaccOfId,
    initialBody,
    matchId,
    draftId,
  })
  const parent = useSnacc(parentId ?? "")
  const quoting = useSnacc(resnaccOfId ?? "")
  const copy = COPY[composer.mode]

  return (
    <ComposerScreen className="overflow-y-auto">
      <ComposerHeader
        title={copy.title}
        onClose={composer.close}
        right={
          composer.drafts.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="font-bold"
              onClick={composer.openDrafts}
            >
              <FileTextIcon /> Drafts · {composer.drafts.length}
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6">
        {composer.ghost ? (
          <span className="flex items-center gap-1.5 self-start rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <GhostIcon className="size-3.5" /> All posts are now anonymous ·
            completely deleted at midnight
          </span>
        ) : null}

        <div
          className={cn(
            composer.ghost &&
              "rounded-2xl border-2 border-dashed border-muted-foreground/40 p-3"
          )}
        >
          {parent.data ? <ReplyTo snacc={parent.data} /> : null}

          <ComposerFrame
            avatarUrl={composer.avatarUrl}
            username={composer.username}
            ghost={composer.ghost}
            ghostTimeLeft={composer.ghostTimeLeft}
            connectDown={!!quoting.data}
          >
            <ComposerInput
              value={composer.body}
              onChange={composer.setBody}
              onCursorChange={composer.setCursor}
              placeholder={copy.placeholder}
            />
          </ComposerFrame>

          {composer.poll ? (
            <div className="mt-3">
              <PollEditor
                poll={composer.poll}
                duplicate={composer.pollDuplicate}
                optionMax={composer.pollOptionMax}
                maxOptions={composer.maxPollOptions}
                onSetOption={composer.setPollOption}
                onAddOption={composer.addPollOption}
                onRemoveOption={composer.removePollOption}
                onPickImage={(index) =>
                  void composer.pickPollOptionImage(index)
                }
                onRemoveImage={composer.removePollOptionImage}
                onSetDuration={composer.setPollDuration}
                onRemove={composer.togglePoll}
              />
            </div>
          ) : null}

          {quoting.data ? (
            <div className="flex gap-3">
              <div className="w-12 shrink-0">
                <QuoteCurve />
              </div>
              <div className="min-w-0 flex-1 pt-4">
                <QuotedSnacc snacc={quoting.data} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ComposerBar>
        {composer.typeahead.open ? (
          <ComposerSuggestions
            suggestions={composer.typeahead.suggestions}
            loading={composer.typeahead.loading}
            onPick={composer.pickSuggestion}
          />
        ) : (
          <ComposerAttachments
            match={composer.match ? liveMatchCard(composer.match) : null}
            onRemoveMatch={composer.removeMatch}
            images={composer.images}
            gif={composer.gif}
            sticker={composer.sticker}
            storedVoice={composer.storedVoice}
            voice={{
              recording: composer.recording,
              durationMs: composer.recordingMs,
              levels: composer.recordingLevels,
              draft: composer.voice,
              onStop: composer.stopVoice,
              onDiscard: composer.discardVoice,
            }}
            onRemoveImage={composer.removeImage}
            onEditImage={composer.editImage}
            onRemoveGif={composer.removeGif}
            onRemoveSticker={composer.removeSticker}
          />
        )}
        <ComposerNudges body={composer.upgrade} image={composer.imageUpgrade} />
        <ComposerToolbar
          canAddImages={composer.canAddImages}
          onAddImages={composer.addImages}
          showTray={composer.showTray}
          canOpenTray={composer.canAddGif || composer.canAddSticker}
          onOpenTray={composer.openStickerTray}
          showVoice={composer.showVoice}
          canRecordVoice={composer.canRecordVoice}
          onRecordVoice={composer.startVoice}
          showPoll={composer.showPoll}
          pollActive={composer.poll !== null}
          canStartPoll={composer.canStartPoll}
          onTogglePoll={composer.togglePoll}
          showSpoiler={composer.hasMedia}
          spoiler={composer.spoiler}
          onToggleSpoiler={composer.toggleSpoiler}
          remaining={composer.remaining}
          showCounter={composer.showCounter}
          upgrade={composer.upgrade}
          right={
            <Button
              size="sm"
              className="h-10 px-5 font-extrabold"
              disabled={!composer.canPost}
              onClick={composer.post}
            >
              Snacc
            </Button>
          }
        />
      </ComposerBar>

      <StickerTraySheet {...composer.stickerTray} />
      <StickerCreator {...composer.stickerCreator} />
      <ImageEditorSheet {...composer.imageEditor} />
      <DraftsSheet {...composer.draftsSheet} />
    </ComposerScreen>
  )
}
