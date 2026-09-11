import type { Metadata } from "next"
import { DeleteAccountScreen } from "@/features/account/screens/delete-account-screen"
import { DELETE_ACCOUNT_PATH } from "@/features/account/routes"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "Delete account" }

export default async function Page() {
  await requireSession(DELETE_ACCOUNT_PATH)

  return <DeleteAccountScreen />
}
