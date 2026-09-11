"use client"

import { EarningsHome } from "../components/earnings-home"
import { useEarningsHome } from "../hooks/use-earnings-home"

export function MyEarnings() {
  const home = useEarningsHome()
  return <EarningsHome {...home} />
}
