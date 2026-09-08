"use client"

import { BanIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { Spinner } from "@/components/ui/spinner"
import { BackHeader } from "@/features/navigation/components/back-header"
import { UserRow, UserRowSkeleton } from "@/features/users/components/user-row"
import { useBack } from "@/hooks/use-back"
import { useBlockedAccounts } from "../hooks/use-blocked-accounts"

export function BlockedAccountsScreen() {
  const back = useBack()
  const blocked = useBlockedAccounts()

  return (
    <>
      <BackHeader title="Blocked accounts" onBack={back} />
      <div className="px-4">
        {blocked.failed ? (
          <LoadFailed
            title="Could not load blocked accounts"
            onRetry={blocked.retry}
          />
        ) : blocked.loading ? (
          <SkeletonRows count={6} item={UserRowSkeleton} />
        ) : blocked.users.length === 0 ? (
          <EmptyState
            icon={BanIcon}
            title="Nobody blocked"
            description="People you block stop seeing you, and you stop seeing them."
            className="py-24"
          />
        ) : (
          blocked.users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              trailing={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={blocked.unblocking === user.id}
                  onClick={() => blocked.unblock(user)}
                >
                  {blocked.unblocking === user.id ? <Spinner /> : "Unblock"}
                </Button>
              }
            />
          ))
        )}
      </div>
    </>
  )
}
