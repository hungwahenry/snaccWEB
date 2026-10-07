"use client"

import { DetailHeader } from "@/features/admin/shell/components/detail"
import type { Option } from "@/features/admin/shell/types"
import { userHandle } from "@/features/admin/shell/utils/user"
import type { AnnouncementEditorState } from "../hooks/use-announcement-editor"
import { timelineLabel } from "../utils/announcement"
import { AnnouncementBadges } from "./announcement-badges"
import { AnnouncementPreview } from "./announcement-preview"
import { AnnouncementResults } from "./announcement-results"
import { AudienceSection } from "./audience-section"
import { ContentSection } from "./content-section"
import { DeliverySection } from "./delivery-section"
import { EditorActions } from "./editor-actions"
import { TimePickerDialog } from "./time-picker-dialog"

export function AnnouncementEditor({
  editor,
  campuses,
}: {
  editor: AnnouncementEditorState
  campuses: { options: Option[]; acronyms: ReadonlyMap<string, string> }
}) {
  const { announcement, draft } = editor

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={announcement?.title ?? "New announcement"}
        badges={
          announcement ? (
            <AnnouncementBadges announcement={announcement} />
          ) : null
        }
        meta={
          announcement ? (
            <>
              <span>{timelineLabel(announcement)}</span>
              {announcement.created_by ? (
                <span>By {userHandle(announcement.created_by)}</span>
              ) : null}
            </>
          ) : null
        }
        actions={<EditorActions editor={editor} />}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          {editor.results ? (
            <AnnouncementResults stats={editor.results} />
          ) : null}
          <ContentSection editor={editor} />
          <AudienceSection editor={editor} campuses={campuses} />
          <DeliverySection editor={editor} />
        </div>
        <div className="min-w-0 lg:sticky lg:top-6">
          <AnnouncementPreview
            title={draft.title}
            message={draft.message}
            imageUrl={announcement?.image?.url ?? null}
            important={announcement?.important ?? false}
            buttons={draft.buttons.map((button) => button.label)}
          />
        </div>
      </div>

      <TimePickerDialog
        title="When should it go out?"
        {...editor.schedule.dialog}
      />
      <TimePickerDialog
        title="Show the banner until"
        {...editor.banner.dialog}
      />
    </div>
  )
}
