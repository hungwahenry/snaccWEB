import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="mb-4 w-fit"
      render={<Link href={href} />}
    >
      <ArrowLeft />
      {label}
    </Button>
  )
}
