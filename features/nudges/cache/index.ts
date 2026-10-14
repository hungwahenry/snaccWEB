import { getQueryClient } from "@/lib/query/client"
import { recordNudgeShown } from "../api"
import type { NudgeKey } from "../types"
import { nudgeKeys } from "../utils/keys"

export function nudgeShown(key: NudgeKey): void {
  getQueryClient().setQueryData<NudgeKey[]>(nudgeKeys.due(), (due) =>
    due?.filter((each) => each !== key)
  )
  void recordNudgeShown(key).catch(() => undefined)
}
