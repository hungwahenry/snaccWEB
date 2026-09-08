import type { FollowUser } from "@/features/follows/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { VisitorSummary } from "../types"

export const getVisitorSummary = () =>
  api.get<VisitorSummary>("/profile-views/summary")

export const listProfileViews = (page: number) =>
  api.get<Paginated<FollowUser>>("/profile-views", { page })

export const updateVisitorSettings = (show: boolean) =>
  api.put<void>("/profile-views/settings", { show })
