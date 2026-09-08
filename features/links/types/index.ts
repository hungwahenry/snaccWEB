import type { EmbeddedSnacc } from "@/features/snaccs/types"
import type { ShareKind } from "@/lib/share-links"

export interface LinkPerson {
  username: string | null
  display_name: string | null
  avatar_url: string
  official: boolean
}

export type LinkTarget =
  | { kind: "snacc"; snacc: EmbeddedSnacc }
  | { kind: "profile"; person: LinkPerson; bio: string | null }
  | { kind: "pay"; person: LinkPerson }
  | {
      kind: "campus"
      slug: string
      name: string
      acronym: string
      logo_url: string | null
    }

export interface ResolvedLink {
  kind: ShareKind
  ref: string
  target: LinkTarget | null
}
