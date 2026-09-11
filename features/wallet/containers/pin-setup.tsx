"use client"

import { PinSetupPanel } from "../components/pin/pin-setup-panel"
import { usePinSetup } from "../hooks/pin/use-pin-setup"
import type { PinSetupMode } from "../types"

export function PinSetup({
  mode,
  onDone,
}: {
  mode: PinSetupMode
  onDone: () => void
}) {
  const setup = usePinSetup(mode, onDone)
  return <PinSetupPanel {...setup} />
}
