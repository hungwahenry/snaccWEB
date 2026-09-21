import type { FollowUser } from "@/features/follows/types"
import type { Snacc } from "@/features/snaccs/types"
import type { Author } from "@/features/users/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  HangoutCard,
  HangoutPayload,
  HangoutScope,
  JoinState,
  SnaccHangout,
} from "../types"

const id = encodeURIComponent
const hangoutPath = (snaccId: string) => `/snaccs/${id(snaccId)}/hangout`

const LIST_PATHS: Record<HangoutScope, string> = {
  campus: "/hangouts",
  mine: "/hangouts/mine",
}

export async function getHangoutAgreement(): Promise<boolean> {
  const { agreed } = await api.get<{ agreed: boolean }>("/hangouts/agreement")
  return agreed
}

export async function agreeToHangouts(): Promise<void> {
  await api.put("/hangouts/agreement")
}

export function listHangouts(
  scope: HangoutScope,
  page: number
): Promise<Paginated<HangoutCard>> {
  return api.get<Paginated<HangoutCard>>(LIST_PATHS[scope], { page })
}

export async function joinHangout(snaccId: string): Promise<JoinState> {
  const { state } = await api.post<{ state: JoinState }>(
    `${hangoutPath(snaccId)}/join`
  )
  return state
}

export async function leaveHangout(snaccId: string): Promise<JoinState> {
  const { state } = await api.del<{ state: JoinState }>(
    `${hangoutPath(snaccId)}/join`
  )
  return state
}

export function listHangoutMembers(
  snaccId: string,
  page: number
): Promise<Paginated<FollowUser>> {
  return api.get<Paginated<FollowUser>>(`${hangoutPath(snaccId)}/members`, {
    page,
  })
}

export async function removeHangoutMember(
  snaccId: string,
  userId: string
): Promise<void> {
  await api.del(`${hangoutPath(snaccId)}/members/${id(userId)}`)
}

export function listHangoutRequests(
  snaccId: string,
  page: number
): Promise<Paginated<Author>> {
  return api.get<Paginated<Author>>(`${hangoutPath(snaccId)}/requests`, {
    page,
  })
}

export async function acceptHangoutRequest(
  snaccId: string,
  userId: string
): Promise<void> {
  await api.post(`${hangoutPath(snaccId)}/requests/${id(userId)}/accept`)
}

export async function declineHangoutRequest(
  snaccId: string,
  userId: string
): Promise<void> {
  await api.del(`${hangoutPath(snaccId)}/requests/${id(userId)}`)
}

export function editHangout(
  snaccId: string,
  edit: HangoutPayload
): Promise<SnaccHangout> {
  return api.patch<SnaccHangout>(hangoutPath(snaccId), edit)
}

export function cancelHangout(snaccId: string): Promise<SnaccHangout> {
  return api.post<SnaccHangout>(`${hangoutPath(snaccId)}/cancel`)
}

export function listHangoutSnaccs(
  snaccId: string,
  page: number
): Promise<Paginated<Snacc>> {
  return api.get<Paginated<Snacc>>(`${hangoutPath(snaccId)}/snaccs`, { page })
}
