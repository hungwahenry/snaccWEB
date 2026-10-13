import type { Metadata } from "next"
import { BIRTH_DATE_PATH } from "@/features/birthdays/routes"
import { BirthDateScreen } from "@/features/birthdays/screens/birth-date-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Your date of birth" }

export default async function Page() {
  await requireSession(BIRTH_DATE_PATH)

  return <BirthDateScreen />
}
