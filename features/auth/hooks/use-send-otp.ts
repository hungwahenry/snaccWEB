"use client"

import { useMutation } from "@tanstack/react-query"
import { sendOtp } from "../api"

/** The login form says what went wrong under the field, so the toast stays quiet. */
export function useSendOtp() {
  return useMutation({ mutationFn: sendOtp, meta: { silent: true } })
}
