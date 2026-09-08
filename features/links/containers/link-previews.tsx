import type { EmbeddedSnacc } from "@/features/snaccs/types"
import { cn } from "@/lib/utils"
import { uniqueShareLinks } from "../utils/unique-links"
import { ResolvedLinkCard } from "./link-card"

export function LinkPreviews({
  body,
  className,
  onOpenSnacc,
}: {
  body: string | null | undefined
  className?: string
  onOpenSnacc?: (snacc: EmbeddedSnacc) => void
}) {
  const links = uniqueShareLinks(body)
  if (links.length === 0) return null

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {links.map((link) => (
        <ResolvedLinkCard
          key={`${link.kind}:${link.ref}`}
          link={link}
          onOpenSnacc={onOpenSnacc}
        />
      ))}
    </div>
  )
}
