import { editWindowClosesAt } from "@/lib/format"
import type { Snacc } from "../types"
import { isPlainResnacc } from "./resnaccs"

export function canEditSnacc(
  snacc: Snacc,
  windowMinutes: number,
  now = Date.now()
): boolean {
  if (!snacc.mine || snacc.status !== undefined) return false
  if (isPlainResnacc(snacc)) return false
  if (windowMinutes <= 0) return false
  return now < editWindowClosesAt(snacc.created_at, windowMinutes)
}
