import { LandingShell } from "@/components/marketing/landing-shell"
import { PublicSnaccCard } from "@/features/snaccs/components/public/public-snacc-card"
import { snaccPath } from "@/features/snaccs/routes"
import type { Snacc } from "@/features/snaccs/types"
import { campusPath } from "../routes"
import type { UniversityDetail } from "../types"
import { CAMPUS_CTA } from "../utils/metadata"
import { CampusHeader } from "./campus-header"

/** A campus as someone who is not signed in sees it: the header and its latest snaccs. */
export function PublicCampus({
  campus,
  snaccs,
}: {
  campus: UniversityDetail
  snaccs: Snacc[]
}) {
  return (
    <LandingShell cta={CAMPUS_CTA} next={campusPath(campus.slug)}>
      <CampusHeader campus={campus} />
      {snaccs.map((snacc) => (
        <PublicSnaccCard
          key={snacc.id}
          snacc={snacc}
          href={snaccPath(snacc.id)}
        />
      ))}
    </LandingShell>
  )
}
