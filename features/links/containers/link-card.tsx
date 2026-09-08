"use client"

import type { EmbeddedSnacc } from "@/features/snaccs/types"
import type { ShareRef } from "@/lib/share-links"
import { LinkCard } from "../components/link-card"
import { useResolvedLink } from "../hooks/use-resolved-link"

export function ResolvedLinkCard({
  link,
  onOpenSnacc,
}: {
  link: ShareRef
  onOpenSnacc?: (snacc: EmbeddedSnacc) => void
}) {
  const { target, loading } = useResolvedLink(link)
  return (
    <LinkCard
      link={link}
      target={target}
      loading={loading}
      onOpenSnacc={onOpenSnacc}
    />
  )
}
