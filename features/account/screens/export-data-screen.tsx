"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { ExportDataPanel } from "../components/export-data-panel"
import { useExportAccount } from "../hooks/use-export-account"

export function ExportDataScreen() {
  const back = useBack("/settings")
  const { run, exporting } = useExportAccount()

  return (
    <>
      <BackHeader title="Download your data" onBack={back} />
      <ExportDataPanel exporting={exporting} onExport={run} />
    </>
  )
}
