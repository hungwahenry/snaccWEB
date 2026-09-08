import { api } from "@/lib/api/client"

export async function hideSnacc(snaccId: string): Promise<void> {
  await api.post("/hides", { snaccId })
}

export async function unhideSnacc(snaccId: string): Promise<void> {
  await api.del(`/hides/${snaccId}`)
}
