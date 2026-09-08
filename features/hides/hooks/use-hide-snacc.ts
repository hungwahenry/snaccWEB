"use client"

import { useMutation } from "@tanstack/react-query"
import { hideSnacc, unhideSnacc } from "../api"

export function useHideSnacc() {
  return useMutation({ mutationFn: hideSnacc })
}

export function useUnhideSnacc() {
  return useMutation({ mutationFn: unhideSnacc })
}
