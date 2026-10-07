export type AnnouncementStatus = "draft" | "scheduled" | "sending" | "sent"

export type AnnouncementPlatform = "ios" | "android" | "web"

export type AnnouncementPremium = "any" | "premium" | "free"

export interface AnnouncementButton {
  label: string
  url: string
}

export interface AnnouncementImage {
  url: string
  width: number
  height: number
}

export interface AnnouncementAudience {
  campus_ids: string[]
  platforms: AnnouncementPlatform[]
  min_version: string | null
  max_version: string | null
  premium: AnnouncementPremium
  joined_within_days: number | null
  quiet_for_days: number | null
}

export interface AnnouncementStats {
  opened: number
  dismissed: number
  taps: number[]
}

export interface AdminAnnouncement {
  id: string
  title: string
  message: string
  image: AnnouncementImage | null
  buttons: AnnouncementButton[]
  status: AnnouncementStatus
  send_at: string | null
  sent_at: string | null
  push: boolean
  important: boolean
  banner_until: string | null
  audience: AnnouncementAudience
  recipients_count: number | null
  stats: AnnouncementStats
  created_by: { id: string; username: string | null } | null
  created_at: string
  updated_at: string
}

export type AnnouncementListQuery = {
  page: number
  perPage: number
  q?: string
  status?: AnnouncementStatus
}

export interface AudienceInput {
  campusIds: string[]
  platforms: AnnouncementPlatform[]
  minVersion: string | null
  maxVersion: string | null
  premium: AnnouncementPremium
  joinedWithinDays: number | null
  quietForDays: number | null
}

export interface AnnouncementReach {
  count: number
}

export interface CreateAnnouncementInput {
  title: string
  message: string
  buttons?: AnnouncementButton[]
  bannerUntil?: string | null
  push?: boolean
  audience?: AudienceInput
}

export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>

export type LinkPresetKey =
  | "premium"
  | "invite"
  | "score"
  | "wallet"
  | "earnings"
  | "eggs"
  | "hangouts"
  | "edit-profile"

export interface LinkPreset {
  key: LinkPresetKey
  label: string
  path: string
}

export type ButtonLink = LinkPresetKey | "other"

export interface ButtonDraft {
  label: string
  link: ButtonLink | null
  url: string
}

export interface AudienceDraft {
  campusIds: string[]
  platforms: AnnouncementPlatform[]
  minVersion: string
  maxVersion: string
  premium: AnnouncementPremium
  joinedWithinDays: string
  quietForDays: string
}

export interface AudienceErrors {
  minVersion: string | null
  maxVersion: string | null
  joinedWithinDays: string | null
  quietForDays: string | null
}

export interface AnnouncementDraft {
  title: string
  message: string
  buttons: ButtonDraft[]
  bannerUntil: string | null
  push: boolean
  audience: AudienceDraft
}

export type EditorStage = "new" | AnnouncementStatus

export interface EditorAbilities {
  editSetup: boolean
  editContent: boolean
  send: boolean
  unschedule: boolean
  remove: boolean
  test: boolean
}

export interface ResultStat {
  key: string
  label: string
  value: string
  hint?: string
}
