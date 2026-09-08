import type { FollowUser } from "@/features/follows/types"
import { api } from "@/lib/api/client"

export const getCampusBirthdays = () =>
  api.get<FollowUser[]>("/users/birthdays/today")
