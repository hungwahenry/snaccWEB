import type { Snacc } from "@/features/snaccs/types"
import { isPlainResnacc } from "@/features/snaccs/utils/resnaccs"

export function isPromotable(snacc: Snacc): boolean {
  return (
    snacc.mine &&
    snacc.parent_id === null &&
    snacc.status === undefined &&
    !snacc.held &&
    !isPlainResnacc(snacc) &&
    (snacc.clip === null || snacc.clip.status === "ready")
  )
}
