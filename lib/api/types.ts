export type ApiResponse<T> = {
  status: "success"
  message: string
  data: T
  meta?: Record<string, unknown>
}

export type Paginated<T> = {
  items: T[]
  page: number
  last_page: number
  per_page: number
  total: number
}

export interface UniversityBadge {
  id: string
  name: string
  acronym: string
}

export interface UserRef {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
}

export interface UserRefWithCampus extends UserRef {
  university: UniversityBadge | null
}
