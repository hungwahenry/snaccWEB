import { getQueryClient } from "@/lib/query/client"
import { earningsKeys } from "../utils/keys"

export function earningsChanged(): void {
  void getQueryClient().invalidateQueries({ queryKey: earningsKeys.all() })
}
