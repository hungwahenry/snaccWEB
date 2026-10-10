"use client"

import { useSearchParams } from "next/navigation"
import { MomentComposeScreen } from "@/features/moments/screens/moment-compose-screen"

export default function Loading() {
  return <MomentComposeScreen snaccId={useSearchParams().get("snacc")} />
}
