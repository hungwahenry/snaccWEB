"use client"

import { CalendarClock, FlaskConical, Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import type { AnnouncementEditorState } from "../hooks/use-announcement-editor"
import { saveLabel, scheduleLabel, sendTitle } from "../utils/announcement"

export function EditorActions({ editor }: { editor: AnnouncementEditorState }) {
  const { stage, can, ready, changed, draft } = editor

  if (stage === "sending") {
    return (
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        Sending…
      </span>
    )
  }

  return (
    <>
      {can.remove ? (
        <CanAct permission="announcements.delete">
          <ConfirmAction
            trigger={
              <Button variant="ghost" size="sm">
                <Trash2 />
                Delete
              </Button>
            }
            title="Delete it and remove it from everyone's notifications?"
            description={
              stage === "sent"
                ? "Pushes already delivered can't be taken back."
                : "This can't be undone."
            }
            confirmLabel="Delete"
            onConfirm={editor.remove}
          />
        </CanAct>
      ) : null}

      {can.unschedule ? (
        <CanAct permission="announcements.write">
          <ActionButton variant="outline" size="sm" onClick={editor.unschedule}>
            Unschedule
          </ActionButton>
        </CanAct>
      ) : null}

      {can.test ? (
        <CanAct permission="announcements.write">
          <ActionButton
            variant="outline"
            size="sm"
            disabled={!ready}
            onClick={editor.sendTest}
          >
            <FlaskConical />
            Send me a test
          </ActionButton>
        </CanAct>
      ) : null}

      {can.editContent ? (
        <CanAct permission="announcements.write">
          <ActionButton
            variant={can.send ? "outline" : "default"}
            size="sm"
            disabled={!ready || !changed}
            onClick={editor.save}
          >
            {saveLabel(stage)}
          </ActionButton>
        </CanAct>
      ) : null}

      {can.send ? (
        <CanAct permission="announcements.write">
          <Button
            variant="outline"
            size="sm"
            disabled={!ready}
            onClick={editor.schedule.open}
          >
            <CalendarClock />
            {scheduleLabel(stage)}
          </Button>
        </CanAct>
      ) : null}

      {can.send ? (
        <CanAct permission="announcements.write">
          <ConfirmAction
            trigger={
              <Button size="sm">
                <Send />
                Send now
              </Button>
            }
            tone="default"
            disabled={!ready}
            title={sendTitle(editor.reach.count)}
            description={
              draft.push
                ? "A push can't be taken back."
                : "It shows in their notifications straight away, without a push."
            }
            confirmLabel="Send now"
            onConfirm={editor.sendNow}
          />
        </CanAct>
      ) : null}
    </>
  )
}
