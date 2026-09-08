"use client"

import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { useVirtualAccount } from "../../hooks/receive/use-virtual-account"
import { AccountCard } from "./account-card"
import { AccountPending } from "./account-pending"
import { ActivationForm } from "./activation-form"

export function ReceivePanel() {
  const account = useVirtualAccount()

  if (account.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }
  if (account.isError) {
    return (
      <div className="py-24">
        <LoadFailed
          title="Could not load this"
          onRetry={() => void account.refetch()}
        />
      </div>
    )
  }

  const data = account.data ?? null

  if (data?.status === "active") return <AccountCard account={data} />
  if (data?.status === "pending")
    return <AccountPending onCheck={() => void account.refetch()} />

  return (
    <ActivationForm
      failureReason={data?.status === "failed" ? data.failure_reason : null}
    />
  )
}
