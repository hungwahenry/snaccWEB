import { ChevronRightIcon } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { WALLET_HOME_COPY } from "../../utils/home-copy"

const RECIPIENTS = [0, 1, 2, 3]
const ROWS = [0, 1, 2, 3]

export function WalletHomeSkeleton({
  accountNumber,
  earnings,
}: {
  accountNumber: boolean
  earnings: boolean
}) {
  const actions = accountNumber ? [0, 1, 2] : [0, 1]

  return (
    <>
      <div className="flex flex-col gap-6 pt-4 pb-2">
        <div className="mx-6 flex flex-col gap-6 rounded-3xl bg-card px-5 py-7">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <Eyebrow>{WALLET_HOME_COPY.balance}</Eyebrow>
              <Skeleton className="size-4 rounded-full bg-accent" />
            </div>
            <Skeleton className="h-12 w-44 bg-accent" />
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-14 flex-1 rounded-full bg-accent" />
            <Skeleton className="h-14 flex-1 rounded-full bg-accent" />
          </div>

          <div className="flex">
            {actions.map((action) => (
              <div
                key={action}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <Skeleton className="size-14 rounded-full bg-accent" />
                <Skeleton className="my-[3px] h-3.5 w-16 bg-accent" />
              </div>
            ))}
          </div>

          {accountNumber ? (
            <div>
              <div className="-mx-5 h-px bg-border" />
              <div className="flex items-center gap-3 pt-4">
                <Skeleton className="size-5 shrink-0 rounded-full bg-accent" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Skeleton className="my-1 h-4 w-32 bg-accent" />
                  <Skeleton className="my-0.5 h-3 w-20 bg-accent" />
                </div>
                <Skeleton className="size-9 rounded-full bg-accent" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex gap-4 overflow-hidden px-6">
          {RECIPIENTS.map((recipient) => (
            <div
              key={recipient}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5"
            >
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="my-0.5 h-3 w-12" />
            </div>
          ))}
        </div>

        {earnings ? (
          <div className="px-6">
            <div className="flex items-center gap-3 py-1">
              <Skeleton className="size-11 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col">
                <Skeleton className="my-1 h-4 w-28" />
                <Skeleton className="my-[3px] h-3.5 w-44 max-w-full" />
              </div>
              <ChevronRightIcon className="size-5 text-muted-foreground" />
            </div>
          </div>
        ) : null}

        <p className="px-6 pt-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
          {WALLET_HOME_COPY.recent}
        </p>
      </div>

      <div className="px-6 pt-5 pb-1">
        <Skeleton className="my-0.5 h-3 w-16" />
      </div>
      {ROWS.map((row) => (
        <div key={row} className="px-6">
          <div className="flex items-center gap-3 py-3">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col">
              <Skeleton className="my-1 h-4 w-36 max-w-full" />
              <Skeleton className="my-[3px] h-3.5 w-20" />
            </div>
            <Skeleton className="my-1 h-4 w-16" />
          </div>
        </div>
      ))}
    </>
  )
}
