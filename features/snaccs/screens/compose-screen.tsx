"use client"

import { CalendarClockIcon, FileTextIcon, GhostIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ComposerBar } from "@/components/ui/composer-bar"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { Spinner } from "@/components/ui/spinner"
import { liveMatchCard } from "@/features/football/utils/card"
import { ImageEditorSheet } from "@/features/image-editor/components/image-editor-sheet"
import { StickerCreator } from "@/features/stickers/components/sticker-creator"
import { StickerTraySheet } from "@/features/stickers/containers/sticker-tray-sheet"
import { useBack } from "@/hooks/use-back"
import { cn } from "@/lib/utils"
import { QuoteCurve } from "../components/card/quote/quote-connector"
import { QuotedSnacc } from "../components/card/quote/quoted-snacc"
import { ComposerAttachments } from "../components/composer/composer-attachments"
import { ComposerFrame } from "../components/composer/composer-frame"
import { ComposerHeader } from "../components/composer/composer-header"
import { ComposerInput } from "../components/composer/composer-input"
import { ComposeScreenSkeleton } from "../components/composer/compose-screen-skeleton"
import { ComposerNudges } from "../components/composer/composer-nudges"
import { ComposerProblem } from "../components/composer/composer-problem"
import { ComposerSuggestions } from "../components/composer/composer-suggestions"
import { ComposerToolbar } from "../components/composer/composer-toolbar"
import { DraftsSheet } from "../components/composer/drafts-sheet"
import { PollEditor } from "../components/composer/poll-editor"
import { ReplyTo } from "../components/composer/reply-to"
import { ScheduleRow } from "../components/composer/schedule-row"
import { ScheduleSheet } from "../components/composer/schedule-sheet"
import { ScheduledSheet } from "../components/scheduled/scheduled-sheet"
import { useComposeScreen } from "../hooks/composer/use-compose-screen"
import { useDrafts } from "../hooks/composer/use-drafts"
import type { ComposeParams } from "../types"
import { COMPOSER_COPY, composerMode } from "../utils/composer"

export function ComposeScreen(props: ComposeParams) {
  const { hydrated } = useDrafts()
  const back = useBack()

  if (props.draftId && !hydrated) {
    return (
      <ComposeScreenSkeleton
        title={COMPOSER_COPY[composerMode(props)].title}
        onClose={back}
      />
    )
  }
  return <ComposeBody {...props} />
}

function ComposeBody(params: ComposeParams) {
  const screen = useComposeScreen(params)
  const { composer, copy } = screen
  const { schedule } = composer

  return (
    <ComposerScreen
      className="overflow-y-auto"
      onImageFiles={composer.canAddImages ? composer.addImageFiles : undefined}
    >
      <ComposerHeader
        title={copy.title}
        onClose={composer.close}
        right={
          screen.draftCount > 0 || screen.scheduledCount > 0 ? (
            <div className="flex shrink-0 items-center">
              {screen.draftCount > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-bold"
                  onClick={screen.openDrafts}
                >
                  <FileTextIcon /> Drafts · {screen.draftCount}
                </Button>
              ) : null}
              {screen.scheduledCount > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-bold"
                  onClick={screen.openScheduled}
                >
                  <CalendarClockIcon /> Scheduled · {screen.scheduledCount}
                </Button>
              ) : null}
            </div>
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
          {screen.parent ? <ReplyTo snacc={screen.parent} /> : null}

          <ComposerFrame
            avatarUrl={composer.avatarUrl}
            username={composer.username}
            ghost={composer.ghost}
            ghostTimeLeft={composer.ghostTimeLeft}
            connectDown={screen.quoting !== null}
          >
            <ComposerInput
              value={composer.body}
              onChange={composer.setBody}
              onCursorChange={composer.setCursor}
              onKeyDown={screen.onKeyDown}
              placeholder={copy.placeholder}
            />
          </ComposerFrame>

          {composer.poll ? (
            <div className="mt-3">
              <PollEditor
                poll={composer.poll}
                problem={composer.pollProblem}
                optionMax={composer.pollOptionMax}
                maxOptions={composer.maxPollOptions}
                onSetOption={composer.setPollOption}
                onAddOption={composer.addPollOption}
                onRemoveOption={composer.removePollOption}
                onPickImage={composer.pickPollOptionImage}
                onRemoveImage={composer.removePollOptionImage}
                onSetDuration={composer.setPollDuration}
                onRemove={composer.togglePoll}
              />
            </div>
          ) : null}

          {screen.quoting ? (
            <div className="flex gap-3">
              <div className="w-12 shrink-0">
                <QuoteCurve />
              </div>
              <div className="min-w-0 flex-1 pt-4">
                <QuotedSnacc snacc={screen.quoting} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ComposerBar>
        {screen.suggestions ? (
          <ComposerSuggestions {...screen.suggestions} />
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
              live: composer.recordingStream,
              draft: composer.voice,
              onStop: composer.stopVoice,
              onDiscard: composer.discardVoice,
            }}
            onRemoveImage={composer.removeImage}
            onEditImage={composer.editImage}
            onRemoveGif={composer.removeGif}
            onRemoveSticker={composer.removeSticker}
            clip={composer.clip}
            onRemoveClip={composer.removeClip}
            onClipCover={composer.setClipCover}
          />
        )}
        {schedule.active ? (
          <div className="px-4 pt-3 pb-2">
            <ScheduleRow
              label={schedule.summary}
              problem={schedule.problem}
              onEdit={schedule.open}
              onClear={schedule.clear}
            />
          </div>
        ) : null}
        <ComposerProblem problem={composer.tagProblem} />
        <ComposerNudges body={composer.upgrade} image={composer.imageUpgrade} />
        <ComposerToolbar
          canAddImages={composer.canAddImages}
          onAddImages={composer.addImages}
          showTray={composer.showTray}
          canOpenTray={composer.canAddGif || composer.canAddSticker}
          onOpenTray={screen.openStickerTray}
          showVoice={composer.showVoice}
          canRecordVoice={composer.canRecordVoice}
          onRecordVoice={composer.startVoice}
          showClip={composer.showClip}
          canAddClip={composer.canAddClip}
          onAddClip={() => void composer.addClip()}
          showPoll={composer.showPoll}
          pollActive={composer.poll !== null}
          canStartPoll={composer.canStartPoll}
          onTogglePoll={composer.togglePoll}
          showSpoiler={composer.hasMedia}
          spoiler={composer.spoiler}
          onToggleSpoiler={composer.toggleSpoiler}
          showSchedule={schedule.available}
          scheduleActive={schedule.active}
          onSchedule={schedule.open}
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
              {schedule.busy ? (
                <Spinner />
              ) : schedule.active ? (
                "Schedule"
              ) : (
                "Snacc"
              )}
            </Button>
          }
        />
      </ComposerBar>

      <StickerTraySheet {...screen.stickerTray} />
      <StickerCreator {...screen.stickerCreator} />
      <ImageEditorSheet {...composer.imageEditor} />
      <DraftsSheet {...screen.draftsSheet} />
      <ScheduledSheet {...screen.scheduledSheet} />
      <ScheduleSheet {...schedule.sheet} />
    </ComposerScreen>
  )
}
