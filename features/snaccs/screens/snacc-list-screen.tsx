"use client"

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useSnaccTracker } from "@/features/snaccs/hooks/use-snacc-tracker"
import { useBack } from "@/hooks/use-back"
import { SnaccSheets } from "../components/sheets/snacc-sheets"
import { SnaccList } from "../components/snacc-list"
import { useSnaccActions } from "../hooks/use-snacc-actions"
import type { Snacc } from "../types"

type ListState = {
  snaccs: Snacc[]
  loading: boolean
  failed: boolean
  loadingMore: boolean
  retry: () => void
  loadMore: () => void
}

type SnaccListScreenProps = {
  title: string
  subtitle?: string
  right?: ReactNode
  list: ListState
  failedTitle: string
  empty: { icon: LucideIcon; title: string; description?: string }
  header?: ReactNode
}

export function SnaccListScreen({
  title,
  subtitle,
  right,
  list,
  failedTitle,
  empty,
  header,
}: SnaccListScreenProps) {
  const back = useBack()
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  const tracker = useSnaccTracker()

  return (
    <>
      <BackHeader
        title={title}
        subtitle={subtitle}
        onBack={back}
        right={right}
      />
      <SnaccList
        snaccs={list.snaccs}
        loading={list.loading}
        failed={list.failed}
        loadingMore={list.loadingMore}
        onRetry={list.retry}
        onLoadMore={list.loadMore}
        handlers={handlers}
        votingPollFor={votingPollFor}
        itemRef={tracker.ref}
        failedTitle={failedTitle}
        empty={empty}
        header={header}
      />
      <SnaccSheets {...sheets} />
    </>
  )
}
