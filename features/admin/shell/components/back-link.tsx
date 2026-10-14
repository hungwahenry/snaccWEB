"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useListReturn } from "../hooks/use-list-return"

export function BackLink({ href, label }: { href: string; label: string }) {
  const target = useListReturn(href)

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mb-4 w-fit"
      render={<Link href={target} />}
    >
      <ArrowLeft />
      {label}
    </Button>
  )
}
