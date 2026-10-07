export interface AnnouncementButton {
  label: string
  url: string
}

export interface AnnouncementImage {
  url: string
  width: number
  height: number
}

export interface AnnouncementBanner {
  id: string
  title: string
  message: string
  image: AnnouncementImage | null
  important: boolean
}

export interface Announcement extends AnnouncementBanner {
  buttons: AnnouncementButton[]
  sent_at: string | null
  banner_until: string | null
}

export type AnnouncementEventKind = "opened" | "tapped" | "dismissed"

export interface AnnouncementEvent {
  id: string
  kind: AnnouncementEventKind
  button?: number
}

export type AnnouncementLink =
  { kind: "app"; path: string } | { kind: "web"; url: string }
