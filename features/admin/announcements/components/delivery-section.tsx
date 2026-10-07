"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import { Section } from "@/features/admin/shell/components/detail"
import { SwitchField } from "@/features/admin/shell/components/form-fields"
import { dateAtTime } from "@/lib/format"
import type { AnnouncementEditorState } from "../hooks/use-announcement-editor"
import { withDraftNote } from "../utils/announcement"

function Row({
  label,
  hint,
  children,
}: {
  label: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-sm font-medium">{label}</p>
        {hint ? (
          <p className="text-xs text-pretty text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}

function Fixed({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 text-sm text-muted-foreground">{children}</span>
  )
}

export function DeliverySection({
  editor,
}: {
  editor: AnnouncementEditorState
}) {
  const { announcement, draft, can, stage } = editor
  const important = announcement?.important ?? false

  return (
    <Section title="Delivery">
      <fieldset
        disabled={!can.editContent}
        className="flex min-w-0 flex-col gap-4 rounded-lg border p-4"
      >
        {can.editSetup ? (
          <SwitchField
            label="Send a push"
            checked={draft.push}
            onChange={editor.setPush}
            hint="Off means it only shows in their notifications, quietly."
          />
        ) : (
          <Row label="Push">
            <Fixed>{announcement?.push ? "With a push" : "No push"}</Fixed>
          </Row>
        )}

        {can.editSetup ? (
          <Row
            label="Important"
            hint={withDraftNote(
              "Reaches people who muted announcements. Keep it for things they really need to know.",
              stage,
              editor.ready
            )}
          >
            <CanAct permission="announcements.important">
              <ActionSwitch
                checked={important}
                label="Mark as important"
                disabled={!editor.canAttach}
                onChange={editor.setImportant}
              />
            </CanAct>
          </Row>
        ) : (
          <Row label="Important">
            <Fixed>{important ? "Yes" : "No"}</Fixed>
          </Row>
        )}

        <div className="flex flex-col gap-2">
          <SwitchField
            label="Show as a banner at the top of the feed"
            checked={draft.bannerUntil !== null}
            onChange={(on) =>
              on ? editor.banner.pick() : editor.banner.clear()
            }
            hint="It stays up until the time you pick, or until they close it."
          />
          {draft.bannerUntil ? (
            <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-sm">
                Until {dateAtTime(draft.bannerUntil)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={editor.banner.pick}
              >
                Change
              </Button>
            </div>
          ) : null}
        </div>
      </fieldset>
    </Section>
  )
}
