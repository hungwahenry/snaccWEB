import type { Bank } from "../types"

export function filterBanks(banks: Bank[], query: string): Bank[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return banks

  return banks.filter((bank) => {
    const name = bank.name.toLowerCase()
    return words.every((word) => name.includes(word))
  })
}
