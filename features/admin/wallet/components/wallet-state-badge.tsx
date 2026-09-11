import { Snowflake } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { walletState } from "../utils/wallet"

export function WalletStateBadge({ frozenAt }: { frozenAt: string | null }) {
  const state = walletState(frozenAt)

  return (
    <Badge variant={state.variant}>
      {frozenAt ? <Snowflake /> : null}
      {state.label}
    </Badge>
  )
}
