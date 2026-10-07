import { getQueryClient } from "@/lib/query/client"
import { announcementKeys } from "../utils/keys"

export function announcementsChanged(): void {
  void getQueryClient().invalidateQueries({
    queryKey: announcementKeys.all(),
  })
}
