"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import {
  ANNOUNCEMENTS_PATH,
  announcementPath,
} from "@/features/admin/shell/routes"
import { dateAtTime } from "@/lib/format"
import type { AdminAnnouncement, AudienceDraft, ButtonDraft } from "../types"
import { EDITOR_ABILITIES, resultStats, stageOf } from "../utils/announcement"
import {
  audienceErrors,
  isAudienceValid,
  pickPlatforms,
  toAudienceInput,
} from "../utils/audience"
import {
  draftFrom,
  hasChanges,
  isDraftReady,
  patchButton,
  toCreateInput,
  toUpdateInput,
  withButton,
  withoutButton,
} from "../utils/draft"
import { useAnnouncementReach } from "./use-announcement-reach"
import { useAnnouncementActions } from "./use-announcements"
import { useTimePicker } from "./use-time-picker"

const SCHEDULE_WINDOW = { leadMinutes: 5, aheadDays: 90, suggestHours: 1 }
const BANNER_WINDOW = { leadMinutes: 5, aheadDays: 90, suggestHours: 72 }

export function useAnnouncementEditor(announcement?: AdminAnnouncement) {
  const router = useRouter()
  const { draft, set, text, replace } = useDraft(() => draftFrom(announcement))
  const [loadedId, setLoadedId] = useState(announcement?.id)
  const actions = useAnnouncementActions()

  if (announcement && announcement.id !== loadedId) {
    setLoadedId(announcement.id)
    replace(draftFrom(announcement))
  }

  const stage = stageOf(announcement)
  const can = EDITOR_ABILITIES[stage]
  const ready = isDraftReady(draft)
  const changed = announcement ? hasChanges(draft, announcement) : true
  const audience = useMemo(
    () =>
      isAudienceValid(draft.audience) ? toAudienceInput(draft.audience) : null,
    [draft.audience]
  )
  const reach = useAnnouncementReach(can.editSetup ? audience : null)

  function setAudience(patch: Partial<AudienceDraft>) {
    replace((current) => ({
      ...current,
      audience: { ...current.audience, ...patch },
    }))
  }

  async function persist(): Promise<string> {
    if (!announcement) {
      const created = await actions.create(toCreateInput(draft))
      return created.id
    }
    if (changed) {
      await actions.update(
        announcement.id,
        toUpdateInput(draft, announcement.status)
      )
    }
    return announcement.id
  }

  async function afterSave(work: (id: string) => Promise<unknown>) {
    const id = await persist()
    try {
      await work(id)
    } finally {
      if (!announcement) router.replace(announcementPath(id))
    }
  }

  function onSaved(work: (id: string) => Promise<unknown>) {
    return announcement ? work(announcement.id) : afterSave(work)
  }

  const schedule = useTimePicker({
    ...SCHEDULE_WINDOW,
    confirmLabel: "Schedule",
    tooSoon: "Pick a time at least 5 minutes from now.",
    describe: (iso) => `Goes out ${dateAtTime(iso)}`,
    onPick: (iso) => afterSave((id) => actions.send(id, iso)),
  })
  const banner = useTimePicker({
    ...BANNER_WINDOW,
    confirmLabel: "Done",
    tooSoon: "Pick a time at least 5 minutes from now.",
    describe: (iso) => `Shows until ${dateAtTime(iso)}`,
    onPick: (iso) => set("bannerUntil", iso),
  })

  return {
    announcement,
    stage,
    can,
    draft,
    text,
    ready,
    canAttach: can.editContent && (announcement !== undefined || ready),
    changed,
    errors: audienceErrors(draft.audience),
    reach,
    results:
      announcement && stage === "sent" ? resultStats(announcement) : null,
    setPush: (push: boolean) => set("push", push),
    setAudience,
    setPlatforms: (values: readonly string[]) =>
      setAudience({ platforms: pickPlatforms(values) }),
    addButton: () =>
      replace((current) => ({
        ...current,
        buttons: withButton(current.buttons),
      })),
    setButton: (index: number, patch: Partial<ButtonDraft>) =>
      replace((current) => ({
        ...current,
        buttons: patchButton(current.buttons, index, patch),
      })),
    removeButton: (index: number) =>
      replace((current) => ({
        ...current,
        buttons: withoutButton(current.buttons, index),
      })),
    banner: {
      dialog: banner.dialog,
      pick: () => banner.start(draft.bannerUntil),
      clear: () => set("bannerUntil", null),
    },
    schedule: {
      dialog: schedule.dialog,
      open: () => schedule.start(announcement?.send_at ?? null),
    },
    save: () => afterSave(() => Promise.resolve()),
    sendTest: () => afterSave((id) => actions.test(id)),
    sendNow: () => afterSave((id) => actions.send(id)),
    unschedule: async () => {
      if (announcement) await actions.unschedule(announcement.id)
    },
    uploadImage: (file: File) => onSaved((id) => actions.uploadImage(id, file)),
    removeImage: async () => {
      if (announcement) await actions.removeImage(announcement.id)
    },
    setImportant: (important: boolean) =>
      onSaved((id) => actions.setImportant(id, important)),
    remove: async () => {
      if (!announcement) return
      await actions.remove(announcement.id)
      router.replace(ANNOUNCEMENTS_PATH)
    },
  }
}

export type AnnouncementEditorState = ReturnType<typeof useAnnouncementEditor>
