import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { InviteSkeleton } from "@/features/referrals/components/invite-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Invite friends" />
      <InviteSkeleton />
    </>
  )
}
