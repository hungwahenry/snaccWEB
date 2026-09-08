import { Input } from "@/components/ui/input"
import type { UsernameStatus } from "../schemas"
import { AvatarPicker } from "./avatar-picker"
import { UsernameField } from "./username-field"

type ProfileStepProps = {
  avatarUri: string | null
  canUploadPhoto: boolean
  onPickAvatar: () => void
  displayName: string
  displayNameMax: number
  onChangeDisplayName: (next: string) => void
  username: string
  usernameMax: number
  onChangeUsername: (next: string) => void
  usernameStatus: UsernameStatus
}

export function ProfileStep({
  avatarUri,
  canUploadPhoto,
  onPickAvatar,
  displayName,
  displayNameMax,
  onChangeDisplayName,
  username,
  usernameMax,
  onChangeUsername,
  usernameStatus,
}: ProfileStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Who are you?
        </h1>
        <p className="text-base leading-6 text-muted-foreground">
          Pick a handle and a name. We&apos;ll draw you an avatar as you type.
        </p>
      </div>

      <AvatarPicker
        uri={avatarUri}
        onPick={onPickAvatar}
        editable={canUploadPhoto}
      />

      <UsernameField
        value={username}
        status={usernameStatus}
        maxLength={usernameMax}
        onChange={onChangeUsername}
      />

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-foreground">
          Display name
        </span>
        <Input
          value={displayName}
          onChange={(event) => onChangeDisplayName(event.target.value)}
          placeholder="Ada Lovelace"
          maxLength={displayNameMax}
          className="h-14 rounded-full px-5 text-base md:text-base"
        />
      </label>
    </div>
  )
}
