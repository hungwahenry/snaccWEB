import { cn } from "@/lib/utils"
import { StoreButtons } from "./store-buttons"

const PHONES = [
  {
    light: "/app-android-light.png",
    dark: "/app-android-dark.png",
    alt: "Snacc on Android",
    className: "rotate-[-7deg] translate-y-[14%]",
  },
  {
    light: "/app-ios-light.png",
    dark: "/app-ios-dark.png",
    alt: "Snacc on iOS",
    className: "-ml-10 rotate-[5deg] translate-y-[8%] sm:-ml-14",
  },
]

const SPRINKLES: {
  emoji: string
  className: string
  blur?: boolean
  trail?: boolean
  behind?: boolean
}[] = [
  { emoji: "🔥", className: "-top-3 -left-6 text-4xl -rotate-12", trail: true },
  { emoji: "😭", className: "top-[16%] -right-8 text-5xl rotate-12" },
  {
    emoji: "💀",
    className: "top-[40%] -left-10 text-3xl rotate-6",
    blur: true,
  },
  {
    emoji: "❤️",
    className: "top-[6%] left-[46%] text-2xl -rotate-6",
    blur: true,
  },
  {
    emoji: "👻",
    className: "top-[58%] -right-6 text-4xl -rotate-12",
    trail: true,
  },
  { emoji: "💸", className: "top-[30%] left-[54%] text-3xl rotate-12" },
  { emoji: "😂", className: "top-[74%] -left-5 text-3xl -rotate-6" },
  {
    emoji: "🎉",
    className: "top-[52%] left-[42%] text-2xl rotate-12",
    blur: true,
  },
  {
    emoji: "🙏",
    className: "-top-6 right-[18%] text-3xl rotate-6",
    behind: true,
  },
  {
    emoji: "📸",
    className: "top-[86%] right-[30%] text-2xl -rotate-12",
    behind: true,
    blur: true,
  },
]

export function DownloadBand({ title, line }: { title: string; line: string }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="overflow-hidden rounded-[2.5rem] bg-muted">
        <div className="grid px-6 pt-14 sm:px-10 lg:grid-cols-2 lg:items-end lg:gap-6 lg:px-16 lg:pt-0">
          <div className="flex flex-col items-center gap-6 text-center lg:order-2 lg:items-start lg:self-center lg:py-20 lg:text-left">
            <h2 className="text-4xl font-black tracking-tighter uppercase sm:text-6xl">
              {title}
            </h2>
            <p className="max-w-md text-lg text-pretty text-muted-foreground">
              {line}
            </p>
            <StoreButtons />
          </div>

          <div className="mt-10 flex h-[22rem] items-end justify-center sm:h-[28rem] lg:order-1 lg:mt-0 lg:h-[34rem] lg:justify-start lg:pl-6">
            <div aria-hidden className="relative flex items-end">
              {PHONES.map((phone) => (
                <Phone key={phone.alt} {...phone} />
              ))}
              {SPRINKLES.map((sprinkle) => (
                <Sprinkle key={sprinkle.emoji} {...sprinkle} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Phone({
  light,
  dark,
  alt,
  className,
}: {
  light: string
  dark: string
  alt: string
  className?: string
}) {
  const screen =
    "aspect-[9/19.5] w-full rounded-[2.2rem] object-cover object-top"

  return (
    <div
      className={cn(
        "relative z-10 w-40 shrink-0 rounded-[2.2rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] sm:w-56 lg:w-60",
        className
      )}
    >
      <img
        src={light}
        alt={alt}
        loading="lazy"
        className={cn(screen, "dark:hidden")}
      />
      <img
        src={dark}
        alt={alt}
        loading="lazy"
        className={cn(screen, "hidden dark:block")}
      />
    </div>
  )
}

function Sprinkle({
  emoji,
  className,
  blur,
  trail,
  behind,
}: {
  emoji: string
  className: string
  blur?: boolean
  trail?: boolean
  behind?: boolean
}) {
  return (
    <span
      className={cn(
        "absolute leading-none select-none",
        behind ? "z-0" : "z-20",
        className
      )}
    >
      {trail ? (
        <>
          <span className="absolute inset-0 -translate-x-8 opacity-20 blur-[6px]">
            {emoji}
          </span>
          <span className="absolute inset-0 -translate-x-4 opacity-40 blur-[3px]">
            {emoji}
          </span>
        </>
      ) : null}
      <span className={cn("relative", blur && "opacity-70 blur-[2px]")}>
        {emoji}
      </span>
    </span>
  )
}
