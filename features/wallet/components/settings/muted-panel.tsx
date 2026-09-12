import { BellOffIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { handleOf, nameOf } from "@/features/users/utils/names"
import { shortDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { MutedScreenProps } from "../../hooks/requests/use-muted-screen"
import type { RequestMute } from "../../types"
import { MutedSkeleton } from "./muted-skeleton"

export function MutedPanel({
  loading,
  failed,
  retry,
  muted,
  isBusy,
  unmute,
}: MutedScreenProps) {
  if (loading) return <MutedSkeleton />

  if (failed) {
    return (
      <div className="py-24">
        <LoadFailed title="Could not load your muted list" onRetry={retry} />
      </div>
    )
  }

  if (muted.length === 0) {
    return (
      <EmptyState
        icon={BellOffIcon}
        title="Nobody is muted"
        description="Decline a money request with “Decline & mute” and that person lands here. They can still send you money — they just cannot ask."
        className="px-10 py-24"
      />
    )
  }

  return (
    <div className="flex flex-col gap-1 px-6 py-6">
      <p className="pb-2 text-sm leading-6 text-muted-foreground">
        These people cannot ask you for money. They can still send you money,
        and they are not told they are muted.
      </p>
      {muted.map((mute) => (
        <MuteRow
          key={mute.id}
          mute={mute}
          busy={isBusy(mute.user.id)}
          onUnmute={() => unmute(mute.user.id)}
        />
      ))}
    </div>
  )
}

function MuteRow({
  mute,
  busy,
  onUnmute,
}: {
  mute: RequestMute
  busy: boolean
  onUnmute: () => void
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <UserAvatar
        alt={nameOf(mute.user)}
        className="size-11"
        avatarUrl={mute.user.avatar_url}
        name={mute.user.username}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-bold text-foreground">
          {handleOf(mute.user) ?? nameOf(mute.user)}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {mute.user.display_name ? `${mute.user.display_name} · ` : ""}
          muted {shortDate(mute.created_at)}
        </span>
      </span>
      <button
        type="button"
        onClick={onUnmute}
        disabled={busy}
        className="relative rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground transition-opacity active:opacity-70"
      >
        {busy ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner className="text-foreground" />
          </span>
        ) : null}
        <span className={cn(busy && "opacity-0")}>Unmute</span>
      </button>
    </div>
  )
}
