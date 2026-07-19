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
