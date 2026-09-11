"use client"

import { useState } from "react"
import type { Bank } from "../../types"
import { useBanks } from "./use-banks"

export function useBankChoice() {
  const banks = useBanks()
  const [bank, setBank] = useState<Bank | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  return {
    bank,
    clear: () => setBank(null),
    open: () => setPickerOpen(true),
    picker: {
      open: pickerOpen,
      onOpenChange: setPickerOpen,
      banks: banks.data ?? [],
      onSelect: (next: Bank) => {
        setBank(next)
        setPickerOpen(false)
      },
    },
  }
}
