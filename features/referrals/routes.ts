export const INVITE_PATH = "/invite"

export const invitePath = (code?: string) =>
  code ? `${INVITE_PATH}?code=${encodeURIComponent(code)}` : INVITE_PATH

export const joinPath = (code: string) => `/join/${encodeURIComponent(code)}`
