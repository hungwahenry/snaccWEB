import { getQueryClient } from "@/lib/query/client"
import { referralKeys } from "../utils/keys"

export function referralsChanged(): void {
  void getQueryClient().invalidateQueries({ queryKey: referralKeys.all() })
}
