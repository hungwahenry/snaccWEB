"use client"

import { useState } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { exportAccount } from "../api"

export function useExportAccount() {
  const [exporting, setExporting] = useState(false)

  async function run() {
    if (exporting) return
    setExporting(true)
    try {
      const data = await exportAccount()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `snacc-data-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      toast.success("Your data was exported.")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setExporting(false)
    }
  }

  return { exporting, run: () => void run() }
}
