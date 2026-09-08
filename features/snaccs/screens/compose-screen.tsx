"use client"

import { GhostIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GifPickerSheet } from "@/features/giphy/components/gif-picker-sheet"
import { cn } from "@/lib/utils"
import { QuoteCurve } from "../components/card/quote/quote-connector"
import { QuotedSnacc } from "../components/card/quote/quoted-snacc"
import { ComposerAttachments } from "../components/composer/composer-attachments"
import { ComposerFrame } from "../components/composer/composer-frame"
import { ComposerHeader } from "../components/composer/composer-header"
import { ComposerInput } from "../components/composer/composer-input"
import { ComposerSuggestions } from "../components/composer/composer-suggestions"
import { ComposerToolbar } from "../components/composer/composer-toolbar"
import { PollEditor } from "../components/composer/poll-editor"
import { ReplyTo } from "../components/composer/reply-to"
import { useComposer, type ComposerMode } from "../hooks/composer/use-composer"
import { useSnacc } from "../hooks/use-snacc"

const COPY: Record<ComposerMode, { title: string; placeholder: string }> = {
  reply: { title: "Reply", placeholder: "Say something about this snacc" },
  quote: { title: "Quote", placeholder: "Add something to this" },
  new: { title: "New snacc", placeholder: "What's happening on campus?" },
}

export function ComposeScreen({
  parentId,
  resnaccOfId,
  initialBody,
}: {
  parentId?: string
  resnaccOfId?: string
  initialBody?: string
}) {
  const composer = useComposer({ parentId, resnaccOfId, initialBody })
  const parent = useSnacc(parentId ?? "")
  const quoting = useSnacc(resnaccOfId ?? "")
  const copy = COPY[composer.mode]

  return (
    <div className="flex min-h-dvh flex-col md:min-h-0">
      <ComposerHeader title={copy.title} onClose={composer.close} />

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

      <div className="sticky bottom-0 z-20 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:static">
        {composer.typeahead.open ? (
          <ComposerSuggestions
            suggestions={composer.typeahead.suggestions}
            loading={composer.typeahead.loading}
            onPick={composer.pickSuggestion}
          />
        ) : (
          <ComposerAttachments
            images={composer.images}
            gif={composer.gif}
            storedVoice={composer.storedVoice}
            onRemoveImage={composer.removeImage}
            onRemoveGif={composer.removeGif}
          />
        )}
        <ComposerToolbar
          canAddImages={composer.canAddImages}
          onAddImages={composer.addImages}
          showGif={composer.showGif}
          canAddGif={composer.canAddGif}
          onOpenGif={composer.openGifPicker}
          showPoll={composer.showPoll}
          pollActive={composer.poll !== null}
          canStartPoll={composer.canStartPoll}
          onTogglePoll={composer.togglePoll}
          showSpoiler={composer.hasMedia}
          spoiler={composer.spoiler}
          onToggleSpoiler={composer.toggleSpoiler}
          remaining={composer.remaining}
          showCounter={composer.showCounter}
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
      </div>

      <GifPickerSheet {...composer.gifPicker} />
    </div>
  )
}
