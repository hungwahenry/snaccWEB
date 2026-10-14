import { api } from "@/lib/api/client"
import type { NudgeKey } from "../types"

export const getDueNudges = () =>
  api.get<{ due: NudgeKey[] }>("/nudges").then((result) => result.due)

export const recordNudgeShown = (key: NudgeKey) =>
  api.post<null>("/nudges/shown", { key })
