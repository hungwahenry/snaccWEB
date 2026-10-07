import { MessageCircleIcon, RepeatIcon } from "lucide-react"
import { LikeGlyph } from "@/features/likes/components/like-glyph"
import { compactCount } from "@/lib/format"

type LightboxActionsProps = {
  likesCount: number
  liked: boolean
  commentsCount: number
  resnaccsCount: number
  onOpenLikers: () => void
  onComment: () => void
  onResnacc?: () => void
}

export function LightboxActions({
  likesCount,
  liked,
  commentsCount,
  resnaccsCount,
  onOpenLikers,
  onComment,
  onResnacc,
}: LightboxActionsProps) {
  return (
    <div className="flex items-center text-white">
      {likesCount > 0 ? (
        <button
          type="button"
          onClick={onOpenLikers}
          aria-label="See who liked this"
          className="flex h-9 items-center gap-1.5 active:scale-95"
        >
          <LikeGlyph liked={liked} size={24} />
          <span className="text-sm font-bold">{compactCount(likesCount)}</span>
        </button>
      ) : null}

      <div className="flex-1" />

      <div className="flex items-center gap-5">
        <Count
          icon={MessageCircleIcon}
          label="Comment"
          count={commentsCount}
          onPress={onComment}
        />
        {onResnacc ? (
          <Count
            icon={RepeatIcon}
            label="Resnacc"
            count={resnaccsCount}
            onPress={onResnacc}
          />
        ) : null}
      </div>
    </div>
  )
}

function Count({
  icon: Icon,
  label,
  count,
  onPress,
}: {
  icon: typeof MessageCircleIcon
  label: string
  count: number
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="flex h-9 items-center gap-1.5 active:scale-95"
    >
      <Icon className="size-6" />
      {count > 0 ? (
        <span className="text-sm font-bold">{compactCount(count)}</span>
      ) : null}
    </button>
  )
}
