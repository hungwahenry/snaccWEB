import { Download } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function DownloadButton({
  label = "Download",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <Link
      href="/download"
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.02]",
        className
      )}
    >
      <Download className="size-4" />
      {label}
    </Link>
  )
}
