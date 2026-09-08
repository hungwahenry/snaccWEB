import { UserAvatar } from "@/components/ui/user-avatar"

type AvatarPickerProps = {
  uri: string | null
  onPick: () => void
  editable?: boolean
}

export function AvatarPicker({
  uri,
  onPick,
  editable = true,
}: AvatarPickerProps) {
  const avatar = (
    <UserAvatar
      alt="Your avatar"
      avatarUrl={uri}
      className="size-20 bg-input"
    />
  )

  if (!editable) return <div className="flex justify-center">{avatar}</div>

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onPick}
        className="rounded-full active:opacity-80"
      >
        {avatar}
      </button>
      <button
        type="button"
        onClick={onPick}
        className="text-sm font-semibold text-foreground active:opacity-70"
      >
        {uri ? "Change photo" : "Add a photo"}
      </button>
    </div>
  )
}
