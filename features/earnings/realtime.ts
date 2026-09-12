import { earningsChanged } from "./cache"

/** A claim is the one thing that moves earnings into the wallet, so every wallet move rechecks them. */
export function onEarningsWallet(): void {
  earningsChanged()
}
