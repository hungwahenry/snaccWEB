export interface Availability {
  open: boolean
  campus: { id: string; name: string; acronym: string } | null
  country: { code: string; name: string } | null
  email: string
}
