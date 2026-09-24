import { Download } from "lucide-react"
import Link from "next/link"
import { DOWNLOAD_PATH } from "@/lib/routes"
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
      href={DOWNLOAD_PATH}
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
