"use client"

import { useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import {
  resolveUsernameStatus,
  sanitizeUsername,
  usernameSchema,
  type UsernameStatus,
} from "../schemas"
import { useUsernameAvailability } from "./use-username-availability"

/// A username input with live availability. A name you already own is always "available".
export function useUsernameField(initial = "", current = "") {
  const [username, setUsername] = useState(initial)
  const debounced = useDebouncedValue(username, 400)
  const isCurrent = current.length > 0 && debounced === current
  const valid = usernameSchema.safeParse(debounced).success
  const availability = useUsernameAvailability(debounced, valid && !isCurrent)

  const status: UsernameStatus =
    current.length > 0 && username === current
      ? "available"
      : resolveUsernameStatus({
          username,
          debouncedUsername: debounced,
          isValid: usernameSchema.safeParse(username).success,
          isFetching: availability.isFetching,
          isAvailable: availability.data?.available,
        })

  return {
    username,
    debounced,
    status,
    change: (text: string) => setUsername(sanitizeUsername(text)),
  }
}
