"use client"

import { useMutation } from "@tanstack/react-query"
import { sendOtp } from "@/features/auth/api"

export function useSendOtp() {
  return useMutation({ mutationFn: sendOtp })
}
