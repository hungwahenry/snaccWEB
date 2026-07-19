export interface AuthUser {
  id: string
  email: string
  role: string
  profile: {
    username: string | null
    display_name: string | null
    avatar_url: string
  } | null
}
