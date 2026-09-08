import { PinIcon, RepeatIcon } from "lucide-react"
import { ProfileLink } from "@/features/users/components/profile-link"
import type { SnaccAuthor } from "../../types"

export function ResnaccHeader({ author }: { author: SnaccAuthor }) {
  return (
    <ProfileLink
      username={author.username}
      className="flex items-center gap-1.5 pl-14 hover:underline"
    >
      <RepeatIcon className="size-4 text-muted-foreground" />
      <span className="truncate text-sm font-bold text-muted-foreground">
        @{author.username} resnacced
      </span>
    </ProfileLink>
  )
}

export function PinnedHeader() {
  return (
    <div className="flex items-center gap-1.5 pl-14">
      <PinIcon className="size-4 text-muted-foreground" />
      <span className="text-sm font-bold text-muted-foreground">Pinned</span>
    </div>
  )
}
