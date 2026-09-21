import { snaccPath } from "@/features/snaccs/routes"

export const HANGOUTS_PATH = "/hangouts"

const hangoutPath = (snaccId: string) => `${snaccPath(snaccId)}/hangout`

export const hangoutMembersPath = (snaccId: string) =>
  `${hangoutPath(snaccId)}/members`
export const hangoutRequestsPath = (snaccId: string) =>
  `${hangoutPath(snaccId)}/requests`
export const hangoutSnaccsPath = (snaccId: string) =>
  `${hangoutPath(snaccId)}/snaccs`
export const editHangoutPath = (snaccId: string) =>
  `${hangoutPath(snaccId)}/edit`
