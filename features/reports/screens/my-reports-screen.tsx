"use client"

import { FlagIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { ReportRow, ReportRowSkeleton } from "../components/report-row"
import { useMyReports } from "../hooks/use-my-reports"

export function MyReportsScreen() {
  const back = useBack()
  const list = useMyReports()

  return (
    <>
      <BackHeader title="Your reports" onBack={back} />
      {list.failed && list.reports.length === 0 ? (
        <LoadFailed title="Could not load your reports" onRetry={list.retry} />
      ) : list.loading ? (
        <SkeletonRows count={6} item={ReportRowSkeleton} />
      ) : list.reports.length === 0 ? (
        <EmptyState
          icon={FlagIcon}
          title="No reports"
          description="Anything you report shows up here."
          className="py-24"
        />
      ) : (
        <>
          {list.reports.map((report) => (
            <ReportRow key={report.id} report={report} />
          ))}
          <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
          <ListFooter loading={list.loadingMore} />
        </>
      )}
    </>
  )
}
