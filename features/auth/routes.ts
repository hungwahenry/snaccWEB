export const LOGIN_PATH = "/login"

export const loginPath = (next?: string) =>
  next ? `${LOGIN_PATH}?next=${encodeURIComponent(next)}` : LOGIN_PATH

export const expiredSessionPath = (next: string) =>
  `/api/session/expired?next=${encodeURIComponent(next)}`
