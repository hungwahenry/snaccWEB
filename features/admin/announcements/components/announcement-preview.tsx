import { Megaphone } from "lucide-react"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { LazyImage } from "@/components/ui/lazy-image"
import { cn } from "@/lib/utils"

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="overflow-hidden rounded-2xl border bg-background">
        {children}
      </div>
    </div>
  )
}

function Placeholder({ children }: { children: ReactNode }) {
  return <span className="text-muted-foreground/70 italic">{children}</span>
}

export function AnnouncementPreview({
  title,
  message,
  imageUrl,
  important,
  buttons,
}: {
  title: string
  message: string
  imageUrl: string | null
  important: boolean
  buttons: string[]
}) {
  const heading = title.trim()
  const body = message.trim()

  return (
    <section className="flex flex-col gap-4" aria-label="Preview">
      <h2 className="text-sm font-semibold">Preview</h2>

      <Frame label="In their notifications">
        <div className="flex items-start gap-3 px-4 py-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-input">
            <Megaphone className="size-5 text-foreground" aria-hidden />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[15px] leading-5 text-foreground">
              {heading || <Placeholder>Your title</Placeholder>}
            </span>
            <span className="line-clamp-2 text-sm text-muted-foreground">
              {body || <Placeholder>Your message</Placeholder>}
            </span>
            <span className="text-xs text-muted-foreground">now</span>
          </span>
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
        </div>
      </Frame>

      <Frame label="When they open it">
        {imageUrl ? (
          <LazyImage
            src={imageUrl}
            alt=""
            className="aspect-video w-full bg-muted object-cover"
          />
        ) : null}
        <div className="flex flex-col gap-3 p-4">
          {important ? (
            <Badge variant="destructive" className="w-fit">
              Important
            </Badge>
          ) : null}
          <h3 className="text-lg leading-6 font-bold text-pretty">
            {heading || <Placeholder>Your title</Placeholder>}
          </h3>
          <p className="text-sm text-pretty whitespace-pre-wrap">
            {body || <Placeholder>Your message</Placeholder>}
          </p>
          {buttons.length > 0 ? (
            <div className="flex flex-col gap-2 pt-1">
              {buttons.map((label, index) => (
                <span
                  key={index}
                  className={cn(
                    buttonVariants({
                      variant: index === 0 ? "default" : "outline",
                    }),
                    "pointer-events-none w-full"
                  )}
                >
                  {label.trim() || <Placeholder>Button label</Placeholder>}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Frame>
    </section>
  )
}
