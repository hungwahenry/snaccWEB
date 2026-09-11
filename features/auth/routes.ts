export const LOGIN_PATH = "/login"

export const loginPath = (next?: string) =>
  next ? `${LOGIN_PATH}?next=${encodeURIComponent(next)}` : LOGIN_PATH
