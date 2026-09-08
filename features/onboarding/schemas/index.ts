import { z } from "zod"

export const USERNAME_PATTERN = /^[a-z][a-z0-9_]+$/

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "At least 3 characters.")
  .max(30, "At most 30 characters.")
  .regex(
    USERNAME_PATTERN,
    "Start with a letter; lowercase letters, numbers, and underscores only."
  )

export type UsernameStatus =
  "idle" | "invalid" | "checking" | "available" | "taken"

export function resolveUsernameStatus({
  username,
  debouncedUsername,
  isValid,
  isFetching,
  isAvailable,
}: {
  username: string
  debouncedUsername: string
  isValid: boolean
  isFetching: boolean
  isAvailable: boolean | undefined
}): UsernameStatus {
  if (username.length === 0) return "idle"
  if (!isValid) return "invalid"
  if (isFetching || username !== debouncedUsername) return "checking"
  if (isAvailable === true) return "available"
  if (isAvailable === false) return "taken"
  return "checking"
}

export function sanitizeUsername(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9_]/g, "")
}
