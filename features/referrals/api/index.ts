import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { Author } from "@/features/users/types"
import type { Invitee, ReferralOverview } from "../types"

export const getReferralOverview = () =>
  api.get<ReferralOverview>("/referrals/me")

export const listInvitees = (page: number) =>
  api.get<Paginated<Invitee>>("/referrals", { page })

export const claimReferral = (code: string) =>
  api.post<Author>("/referrals/claim", { code })
