import { MessageCircle, Repeat2, type LucideIcon } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

function avatar(seed: string) {
  return `https://api.dicebear.com/9.x/thumbs/png?seed=${seed}`
}

export function SnaccDeck() {
  return (
    <div className="flex items-center justify-center">
      <FloatingCard rotate={-7} baseY={12} delay="0s" className="z-10">
        <SnaccMock
          name="Ada"
          handle="ada_l"
          campus="FUT"
          time="2m"
          seed="ada"
          body="the jollof at the caf is criminal today 😭 and the ATM's been down since monday. i've been on garri and pure water for three days straight, campus please fix your life 🙏 who do we even complain to at this point fr"
          lines={12}
          reactions={["😭", "❤️", "🔥"]}
          total={24}
          comments={6}
          resnaccs={2}
        />
      </FloatingCard>

      <FloatingCard rotate={2} baseY={-6} delay="0.32s" className="z-30 -ml-16">
        <SnaccMock
          name="Tunde"
          handle="tundex"
          campus="OAU"
          time="5m"
          seed="tunde"
          body="sunset from the hostel roof 🌇"
          media="/welcome-photo.png"
          reactions={["❤️", "😍"]}
          total={41}
          comments={3}
          resnaccs={1}
        />
      </FloatingCard>

      <FloatingCard rotate={8} baseY={16} delay="0.62s" className="z-20 -ml-16">
        <SnaccMock
          name="Zainab"
          handle="zee"
          campus="ABU"
          time="9m"
          seed="zainab"
          body="me walking into that 8am 💀"
          media="/welcome-gif.gif"
          reactions={["💀", "😂"]}
          total={58}
          comments={12}
          resnaccs={4}
        />
      </FloatingCard>
    </div>
  )
}

type SnaccMockProps = {
  name: string
  handle: string
  campus: string
  time: string
  seed: string
  body: string
  lines?: number
  media?: string
  reactions: string[]
  total: number
  comments: number
  resnaccs: number
}

function SnaccMock({
  name,
  handle,
  campus,
  time,
  seed,
  body,
  lines = 2,
  media,
  reactions,
  total,
  comments,
  resnaccs,
}: SnaccMockProps) {
  const clamp: CSSProperties = {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar(seed)} alt="" className="bg-muted size-9 shrink-0 rounded-full" />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-foreground shrink truncate text-sm font-extrabold">{name}</span>
            <span className="text-muted-foreground truncate text-xs">@{handle}</span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-muted-foreground text-xs font-bold">{campus}</span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-muted-foreground text-xs">{time}</span>
          </div>

          <p className="text-foreground text-sm leading-5" style={clamp}>
            {body}
          </p>
        </div>
      </div>

      {media ? (
        <div className="bg-muted overflow-hidden rounded-xl" style={{ aspectRatio: "16 / 10" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media} alt="" className="size-full object-cover" />
        </div>
      ) : null}

      <div className="flex items-center">
        <div className="bg-muted flex h-8 items-center gap-1.5 rounded-full px-2.5">
          <div className="flex items-center gap-0.5">
            {reactions.map((emoji) => (
              <span key={emoji} className="text-sm">
                {emoji}
              </span>
            ))}
          </div>
          <span className="text-muted-foreground text-xs font-extrabold">{total}</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <ActionCount icon={MessageCircle} count={comments} />
          <ActionCount icon={Repeat2} count={resnaccs} />
        </div>
      </div>
    </div>
  )
}

function ActionCount({ icon: Icon, count }: { icon: LucideIcon; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="text-muted-foreground size-4" />
      <span className="text-muted-foreground text-xs font-bold">{count}</span>
    </div>
  )
}

function FloatingCard({
  rotate,
  baseY,
  delay,
  className,
  children,
}: {
  rotate: number
  baseY: number
  delay: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn("shrink-0", className)}
      style={{ transform: `rotate(${rotate}deg) translateY(${baseY}px)` }}
    >
      <div
        className="snacc-bob bg-card w-56 rounded-2xl p-3 shadow-[0_6px_14px_rgba(0,0,0,0.12)]"
        style={{ animationDelay: delay }}
      >
        {children}
      </div>
    </div>
  )
}
