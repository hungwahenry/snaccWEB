"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMe, login, logout, sendOtp } from "../api/auth"

export const ME_KEY = ["me"]

export function useMe() {
  return useQuery({ queryKey: ME_KEY, queryFn: getMe, retry: false, staleTime: 5 * 60_000 })
}

export function useSendOtp() {
  return useMutation({ mutationFn: sendOtp })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => queryClient.setQueryData(ME_KEY, data.user),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: logout, onSuccess: () => queryClient.clear() })
}
