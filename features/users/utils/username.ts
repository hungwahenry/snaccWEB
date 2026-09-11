export type UsernameStatus =
  "idle" | "invalid" | "checking" | "available" | "taken"

export const USERNAME_MIN_LENGTH = 3
const USERNAME_PATTERN = /^[a-z][a-z0-9_]*$/

/** What typing produces: lowercase, and only the characters a username can hold. */
export function normalizeUsername(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9_]/g, "")
}

/** Why a username cannot be used as typed, or null when its shape is fine. */
export function usernameProblem(
  username: string,
  maxLength: number
): string | null {
  if (username.length < USERNAME_MIN_LENGTH)
    return `At least ${USERNAME_MIN_LENGTH} characters.`
  if (username.length > maxLength) return `At most ${maxLength} characters.`
  if (!USERNAME_PATTERN.test(username))
    return "Start with a letter; lowercase letters, numbers, and underscores only."
  return null
}

export function usernameStatus(input: {
  typed: string
  settled: string
  current: string
  valid: boolean
  checking: boolean
  available: boolean | undefined
}): UsernameStatus {
  if (input.current && input.typed === input.current) return "available"
  if (input.typed.length === 0) return "idle"
  if (!input.valid) return "invalid"
  if (input.checking || input.typed !== input.settled) return "checking"
  if (input.available === true) return "available"
  if (input.available === false) return "taken"
  return "checking"
}

/** The line under the field: why it cannot be used, or nothing. */
export function usernameMessage(
  status: UsernameStatus,
  problem: string | null
): string | null {
  if (status === "invalid") return problem
  if (status === "taken") return "That one is taken."
  return null
}
