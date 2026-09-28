export interface NotificationActor {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
}

export interface NotificationTarget {
  kind: string
  ref: string | null
}

export interface Notification {
  id: string
  type: string
  actor_count: number
  actor: NotificationActor | null
  body: string
  detail: string | null
  icon_name: string
  uses_icon: boolean
  target: NotificationTarget | null
  read_at: string | null
  seen_at: string | null
  last_activity_at: string
}

export interface NotificationPreference {
  category: string
  label: string
  section: string
  section_label: string
  push: boolean
  email: boolean
  emailable: boolean
}

export interface PreferenceSection {
  key: string
  label: string
  preferences: NotificationPreference[]
}
