"use client"

import { Users } from "lucide-react"
import { useId, type ReactNode } from "react"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Section } from "@/features/admin/shell/components/detail"
import { FormNote } from "@/features/admin/shell/components/form-dialog"
import {
  SelectField,
  TextField,
} from "@/features/admin/shell/components/form-fields"
import type { Option } from "@/features/admin/shell/types"
import type { AnnouncementEditorState } from "../hooks/use-announcement-editor"
import { reachLabel } from "../utils/announcement"
import {
  audienceSummary,
  PLATFORM_LABELS,
  PLATFORMS,
  PREMIUM_OPTIONS,
} from "../utils/audience"
import { CampusPicker } from "./campus-picker"

function problem(message: string | null, fallback?: string): ReactNode {
  return message ? (
    <span className="text-destructive">{message}</span>
  ) : (
    fallback
  )
}

function ReachNote({ reach }: { reach: AnnouncementEditorState["reach"] }) {
  if (reach.failed) {
    return (
      <span className="text-sm text-muted-foreground">
        Couldn&apos;t count who it reaches.
      </span>
    )
  }
  if (reach.count === undefined && !reach.counting) {
    return (
      <span className="text-sm text-muted-foreground">
        Fix what&apos;s in red to see who it reaches.
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
      {reach.counting ? (
        <Spinner className="size-3.5" />
      ) : (
        <Users className="size-4" aria-hidden />
      )}
      {reach.count === undefined ? "Counting…" : reachLabel(reach.count)}
    </span>
  )
}

export function AudienceSection({
  editor,
  campuses,
}: {
  editor: AnnouncementEditorState
  campuses: { options: Option[]; acronyms: ReadonlyMap<string, string> }
}) {
  const id = useId()
  const { announcement, draft, errors } = editor
  const audience = draft.audience

  if (!editor.can.editSetup && announcement) {
    return (
      <Section title="Who gets it">
        <p className="rounded-lg border px-4 py-3 text-sm text-pretty">
          {audienceSummary(announcement.audience, campuses.acronyms)}
        </p>
      </Section>
    )
  }

  return (
    <Section
      title="Who gets it"
      description="Leave everything empty to reach everyone."
      action={<ReachNote reach={editor.reach} />}
    >
      <div className="flex min-w-0 flex-col gap-4 rounded-lg border p-4">
        <Field>
          <FieldLabel htmlFor={`${id}-campuses`}>Campuses</FieldLabel>
          <CampusPicker
            id={`${id}-campuses`}
            options={campuses.options}
            acronyms={campuses.acronyms}
            value={audience.campusIds}
            onChange={(campusIds) => editor.setAudience({ campusIds })}
          />
          <FieldDescription>Leave it empty for every campus.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Platforms</FieldLabel>
          <ToggleGroup
            aria-label="Platforms"
            multiple
            variant="outline"
            size="sm"
            value={audience.platforms}
            onValueChange={editor.setPlatforms}
          >
            {PLATFORMS.map((platform) => (
              <ToggleGroupItem key={platform} value={platform}>
                {PLATFORM_LABELS[platform]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <FieldDescription>
            Pick none to reach people on every platform.
          </FieldDescription>
        </Field>

        <div className="flex flex-col gap-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="App version from"
              optional
              placeholder="1.4.0"
              autoComplete="off"
              hint={problem(errors.minVersion)}
              value={audience.minVersion}
              onChange={(event) =>
                editor.setAudience({ minVersion: event.target.value })
              }
            />
            <TextField
              label="App version up to"
              optional
              placeholder="No limit"
              autoComplete="off"
              hint={problem(errors.maxVersion)}
              value={audience.maxVersion}
              onChange={(event) =>
                editor.setAudience({ maxVersion: event.target.value })
              }
            />
          </div>
          <FormNote>
            Versions only apply to the iPhone and Android apps. Once you set
            one, people on the web are left out.
          </FormNote>
        </div>

        <SelectField
          label="Premium"
          value={audience.premium}
          options={PREMIUM_OPTIONS}
          onChange={(premium) => editor.setAudience({ premium })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Joined Snacc in the last"
            optional
            inputMode="numeric"
            placeholder="Any time"
            autoComplete="off"
            hint={problem(errors.joinedWithinDays, "Number of days.")}
            value={audience.joinedWithinDays}
            onChange={(event) =>
              editor.setAudience({ joinedWithinDays: event.target.value })
            }
          />
          <TextField
            label="Haven't used Snacc for at least"
            optional
            inputMode="numeric"
            placeholder="Any"
            autoComplete="off"
            hint={problem(errors.quietForDays, "Number of days.")}
            value={audience.quietForDays}
            onChange={(event) =>
              editor.setAudience({ quietForDays: event.target.value })
            }
          />
        </div>
      </div>
    </Section>
  )
}
