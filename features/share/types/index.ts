import type { UniversityDetail } from "@/features/campus/types"
import type { Snacc } from "@/features/snaccs/types"
import type { PublicProfile } from "@/features/users/types"

export type ShareSubject =
  | { kind: "snacc"; snacc: Snacc }
  | { kind: "profile"; profile: PublicProfile }
  | { kind: "campus"; university: UniversityDetail }
