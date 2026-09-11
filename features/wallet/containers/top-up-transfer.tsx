"use client"

import { TransferDetails } from "../components/pay/transfer-details"
import type { PayFlow } from "../hooks/pay/use-pay-flow"
import { useTransferDetails } from "../hooks/pay/use-transfer-details"

/** Kept apart from the pay flow so only this part redraws as the countdown ticks. */
export function TopUpTransfer(props: NonNullable<PayFlow["transfer"]>) {
  const details = useTransferDetails(props.transfer)
  return <TransferDetails {...props} {...details} />
}
