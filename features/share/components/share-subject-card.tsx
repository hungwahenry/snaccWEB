import { UniversityShareCard } from "@/features/campus/components/share/university-share-card"
import { ShareCard } from "@/features/snaccs/components/share/share-card"
import { ProfileShareCard } from "@/features/users/components/share/profile-share-card"
import type { ShareSubject } from "../types"

export function ShareSubjectCard({ subject }: { subject: ShareSubject }) {
  if (subject.kind === "snacc") return <ShareCard snacc={subject.snacc} />
  if (subject.kind === "campus")
    return <UniversityShareCard university={subject.university} />

  return <ProfileShareCard profile={subject.profile} />
}
