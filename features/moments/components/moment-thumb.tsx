import { cn } from "@/lib/utils"

const SIZES = {
  card: { width: 124, height: 186 },
  small: { width: 32, height: 48 },
} as const

/** A moment in miniature, wherever one is answered: its photo or colour, and its words when there is room. */
export function MomentThumb({
  body,
  background,
  imageUrl,
  size = "card",
}: {
  body: string | null
  background: string | null
  imageUrl: string | null
  size?: keyof typeof SIZES
}) {
  const card = size === "card"

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden",
        card ? "rounded-xl" : "rounded-md"
      )}
      style={{ ...SIZES[size], backgroundColor: background ?? "#000000" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          draggable={false}
          className="size-full object-cover"
        />
      ) : null}

      {card && body ? (
        imageUrl ? (
          <p className="absolute inset-x-0 bottom-0 line-clamp-2 bg-black/45 px-2 py-1.5 text-[10px] leading-[13px] font-medium text-white">
            {body}
          </p>
        ) : (
          <p className="absolute inset-0 flex items-center justify-center overflow-hidden px-2.5 text-center text-[13px] leading-[17px] font-extrabold break-words text-white">
            <span className="line-clamp-7">{body}</span>
          </p>
        )
      ) : null}
    </div>
  )
}
