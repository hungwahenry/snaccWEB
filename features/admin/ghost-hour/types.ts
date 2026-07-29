export interface GhostWindowState {
  active: boolean
  starts_at: string | null
  ends_at: string | null
  server_time: string
  window_minutes: number
  pushed?: number
}
