"use client"

import { useMutation } from "@tanstack/react-query"
import { saveSnacc, unsaveSnacc } from "../api"

export function useBookmark() {
  return useMutation({ mutationFn: saveSnacc })
}

export function useUnbookmark() {
  return useMutation({ mutationFn: unsaveSnacc })
}
