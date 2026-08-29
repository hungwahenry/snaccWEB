import type { WithdrawalStatus } from "../types"

export const STATUS_VARIANT: Record<
  WithdrawalStatus,
  "secondary" | "default" | "destructive" | "outline"
> = {
  pending: "secondary",
  success: "default",
  failed: "destructive",
  reversed: "outline",
}
