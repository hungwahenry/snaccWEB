"use client"

import { useState } from "react"
import { exportAccount } from "../api"
import { showError, showSuccess } from "@/lib/feedback"

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
      showSuccess("Your data was exported.")
    } catch (error) {
      showError(error)
    } finally {
      setExporting(false)
    }
  }

  return { exporting, run: () => void run() }
}
