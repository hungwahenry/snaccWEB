import type { FollowUser } from "@/features/follows/types"
import { api } from "@/lib/api/client"
import type { KnownBirthDate } from "../types"

export const getCampusBirthdays = () =>
  api.get<FollowUser[]>("/users/birthdays/today")

export const getKnownBirthDate = () =>
  api.get<KnownBirthDate>("/profile/birth-date")

export const setBirthDate = (date: {
  birthDay: number
  birthMonth: number
  birthYear: number
}) => api.put<null>("/profile/birth-date", date)
