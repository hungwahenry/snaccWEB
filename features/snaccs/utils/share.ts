import { signal } from "@/features/signals/utils/queue"
import { copyLink, shareLink, shareOrCopy } from "@/lib/share-links"
import type { Snacc } from "../types"

function lead(snacc: Snacc): string {
  const who = snacc.anonymous
    ? null
    : (snacc.author.display_name ??
      (snacc.author.username ? `@${snacc.author.username}` : null))
  return who ? `${who} on Snacc` : "Check out this snacc on Snacc"
}

export function shareSnaccLink(snacc: Snacc) {
  signal("share", { subjectId: snacc.id, detail: "sheet" })
  return shareOrCopy(
    shareLink.snacc(snacc.id),
    `${lead(snacc)} 👀`,
    "Snacc link"
  )
}

export function copySnaccLink(snacc: Snacc) {
  signal("share", { subjectId: snacc.id, detail: "copy" })
  return copyLink(shareLink.snacc(snacc.id), "Snacc link")
}
