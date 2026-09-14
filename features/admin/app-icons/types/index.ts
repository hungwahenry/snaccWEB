export interface AdminAppIcon {
  id: string
  key: string
  label: string
  position: number
  enabled: boolean
  updated_at: string
}

export interface UpdateAppIconInput {
  label?: string
  position?: number
  enabled?: boolean
}

export interface PositionUpdate {
  id: string
  position: number
}

export type MoveDirection = "up" | "down"

export interface AppIconDraft {
  label: string
}
