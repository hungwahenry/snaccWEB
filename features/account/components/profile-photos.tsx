import { CameraIcon, XIcon } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"

export function ProfilePhotos({
  coverUri,
  avatarUri,
  onPickCover,
  onRemoveCover,
  onPickAvatar,
}: {
  coverUri: string | null
  avatarUri: string
  onPickCover: () => void
  onRemoveCover: () => void
  onPickAvatar: () => void
}) {
  return (
    <div className="-mx-6 flex flex-col">
      <div className="relative h-32 bg-muted">
        {coverUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUri} alt="" className="size-full object-cover" />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/20">
          <button
            type="button"
            onClick={onPickCover}
            aria-label="Change banner"
            className="flex size-11 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <CameraIcon className="size-5" />
          </button>
          {coverUri ? (
            <button
              type="button"
              onClick={onRemoveCover}
              aria-label="Remove banner"
              className="flex size-11 items-center justify-center rounded-full bg-black/50 text-white"
            >
              <XIcon className="size-5" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="px-6">
        <button
          type="button"
          onClick={onPickAvatar}
          aria-label="Change photo"
          className="relative -mt-10 block rounded-full ring-4 ring-background"
        >
          <UserAvatar
            alt="Your avatar"
            avatarUrl={avatarUri}
            className="size-20"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 text-white">
            <CameraIcon className="size-5" />
          </span>
        </button>
      </div>
    </div>
  )
}
