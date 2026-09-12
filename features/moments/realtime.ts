import { getQueryClient } from "@/lib/query/client"
import { authorMomentsKey, MOMENTS_TRAY_KEY } from "./utils/keys"

export function onMomentsChanged({ author_id }: { author_id: string }): void {
  const client = getQueryClient()
  void client.invalidateQueries({ queryKey: MOMENTS_TRAY_KEY })
  void client.invalidateQueries({ queryKey: authorMomentsKey(author_id) })
}
