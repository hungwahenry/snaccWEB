import { Skeleton } from "@/components/ui/skeleton"

export function WalletHomeSkeleton({
  accountNumber,
  earnings,
}: {
  accountNumber: boolean
  earnings: boolean
}) {
  const actions = accountNumber ? [0, 1, 2] : [0, 1]

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="mx-6 flex flex-col gap-6 rounded-3xl bg-card px-5 py-7">
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-12 w-44 rounded-2xl" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-14 flex-1 rounded-full" />
          <Skeleton className="h-14 flex-1 rounded-full" />
        </div>
        <div className="flex">
          {actions.map((action) => (
            <div
              key={action}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
          ))}
        </div>
        {accountNumber ? (
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <Skeleton className="size-5 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </div>
            <Skeleton className="size-9 rounded-full" />
          </div>
        ) : null}
      </div>

      <div className="flex gap-4 px-6">
        {[0, 1, 2, 3].map((recipient) => (
          <div
            key={recipient}
            className="flex w-16 flex-col items-center gap-1.5"
          >
            <Skeleton className="size-14 rounded-full" />
            <Skeleton className="h-2.5 w-12 rounded-full" />
          </div>
        ))}
      </div>

      {earnings ? (
        <div className="flex items-center gap-3 px-6">
          <Skeleton className="size-11 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-28 rounded-full" />
            <Skeleton className="h-3 w-44 rounded-full" />
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1 px-6">
        <Skeleton className="mb-1 h-3 w-24 rounded-full" />
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="flex items-center gap-3 py-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-36 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
