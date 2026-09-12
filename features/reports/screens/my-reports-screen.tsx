"use client"

import { FlagIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { ReportRow } from "../components/report-row"
import { ReportRowSkeleton } from "../components/report-row-skeleton"
import { useMyReports } from "../hooks/use-my-reports"
import { reportSubject } from "../utils/subject"

export function MyReportsScreen() {
  const back = useBack()
  const query = useMyReports()

  return (
    <>
      <BackHeader title="Your reports" onBack={back} />
      {query.isError ? (
        <LoadFailed
          title="Could not load your reports"
          onRetry={() => void query.refetch()}
        />
      ) : query.isPending ? (
        <SkeletonRows count={6} item={ReportRowSkeleton} />
      ) : query.data.length === 0 ? (
        <EmptyState
          icon={FlagIcon}
          title="No reports"
          description="Anything you report shows up here."
          className="py-24"
        />
      ) : (
        query.data.map((report) => (
          <ReportRow
            key={report.id}
            report={report}
            subject={reportSubject(report.target)}
          />
        ))
      )}
    </>
  )
}
