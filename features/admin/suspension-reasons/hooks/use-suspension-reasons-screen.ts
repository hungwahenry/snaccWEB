"use client"

import {
  useSuspensionReasonActions,
  useSuspensionReasons,
} from "./use-suspension-reasons"

export function useSuspensionReasonsScreen() {
  return {
    query: useSuspensionReasons(),
    actions: useSuspensionReasonActions(),
  }
}
