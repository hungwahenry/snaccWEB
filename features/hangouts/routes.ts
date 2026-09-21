import { snaccPath } from "@/features/snaccs/routes"

export const HANGOUTS_PATH = "/hangouts"

export const hangoutInfoPath = (snaccId: string) =>
  `${snaccPath(snaccId)}/hangout`

export const hangoutMembersPath = (snaccId: string) =>
  `${hangoutInfoPath(snaccId)}/members`
export const hangoutRequestsPath = (snaccId: string) =>
  `${hangoutInfoPath(snaccId)}/requests`
export const hangoutSnaccsPath = (snaccId: string) =>
  `${hangoutInfoPath(snaccId)}/snaccs`
export const editHangoutPath = (snaccId: string) =>
  `${hangoutInfoPath(snaccId)}/edit`
