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
