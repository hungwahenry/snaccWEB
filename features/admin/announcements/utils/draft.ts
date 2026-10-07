import type {
  AdminAnnouncement,
  AnnouncementDraft,
  AnnouncementStatus,
  ButtonDraft,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "../types"
import { audienceDraftFrom, isAudienceValid, toAudienceInput } from "./audience"
import { isHttpsLink, linkFor, linkUrl } from "./links"

export const LIMITS = {
  title: 200,
  message: 2000,
  buttonLabel: 40,
  buttons: 2,
} as const

const EMPTY_BUTTON: ButtonDraft = { label: "", link: null, url: "" }

export function draftFrom(announcement?: AdminAnnouncement): AnnouncementDraft {
  return {
    title: announcement?.title ?? "",
    message: announcement?.message ?? "",
    buttons: (announcement?.buttons ?? []).map((button) => ({
      label: button.label,
      ...linkFor(button.url),
    })),
    bannerUntil: announcement?.banner_until ?? null,
    push: announcement?.push ?? true,
    audience: audienceDraftFrom(announcement?.audience),
  }
}

export function withButton(buttons: ButtonDraft[]): ButtonDraft[] {
  return buttons.length >= LIMITS.buttons ? buttons : [...buttons, EMPTY_BUTTON]
}

export function patchButton(
  buttons: ButtonDraft[],
  index: number,
  patch: Partial<ButtonDraft>
): ButtonDraft[] {
  return buttons.map((button, at) =>
    at === index ? { ...button, ...patch } : button
  )
}

export function withoutButton(
  buttons: ButtonDraft[],
  index: number
): ButtonDraft[] {
  return buttons.filter((_, at) => at !== index)
}

function fits(text: string, max: number): boolean {
  const length = text.trim().length

  return length > 0 && length <= max
}

export function isButtonReady(button: ButtonDraft): boolean {
  return (
    fits(button.label, LIMITS.buttonLabel) &&
    button.link !== null &&
    (button.link !== "other" || isHttpsLink(button.url))
  )
}

export function isDraftReady(draft: AnnouncementDraft): boolean {
  return (
    fits(draft.title, LIMITS.title) &&
    fits(draft.message, LIMITS.message) &&
    draft.buttons.length <= LIMITS.buttons &&
    draft.buttons.every(isButtonReady) &&
    isAudienceValid(draft.audience)
  )
}

export function toCreateInput(
  draft: AnnouncementDraft
): CreateAnnouncementInput {
  return {
    title: draft.title.trim(),
    message: draft.message.trim(),
    buttons: draft.buttons.map((button) => ({
      label: button.label.trim(),
      url: linkUrl(button.link, button.url),
    })),
    bannerUntil: draft.bannerUntil,
    push: draft.push,
    audience: toAudienceInput(draft.audience),
  }
}

export function toUpdateInput(
  draft: AnnouncementDraft,
  status: AnnouncementStatus
): UpdateAnnouncementInput {
  const { push, audience, ...content } = toCreateInput(draft)

  return status === "draft" || status === "scheduled"
    ? { ...content, push, audience }
    : content
}

export function hasChanges(
  draft: AnnouncementDraft,
  announcement: AdminAnnouncement
): boolean {
  const saved = toUpdateInput(draftFrom(announcement), announcement.status)

  return (
    JSON.stringify(toUpdateInput(draft, announcement.status)) !==
    JSON.stringify(saved)
  )
}
