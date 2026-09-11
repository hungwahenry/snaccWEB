"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { checkUsername } from "../api"
import { userKeys } from "../utils/keys"
import {
  normalizeUsername,
  usernameMessage,
  usernameProblem,
  usernameStatus,
} from "../utils/username"

/** A username being typed, checked against the rules and then against who has it already. */
export function useUsernameField(current = "") {
  const maxLength = useConfigValue("profile.username.max_length")
  const [value, setValue] = useState(current)
  const settled = useDebouncedValue(value, 400)

  const settledValid = usernameProblem(settled, maxLength) === null
  const availability = useQuery({
    queryKey: userKeys.usernameCheck(settled),
    queryFn: () => checkUsername(settled),
    enabled: settledValid && settled !== current,
    placeholderData: keepPreviousData,
  })

  const problem = value.length > 0 ? usernameProblem(value, maxLength) : null
  const status = usernameStatus({
    typed: value,
    settled,
    current,
    valid: problem === null,
    checking: availability.isFetching,
    available: availability.data?.available,
  })

  return {
    value,
    change: (text: string) => setValue(normalizeUsername(text)),
    status,
    message: usernameMessage(status, problem),
    maxLength,
  }
}
