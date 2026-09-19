"use client"

import Link from "next/link"
import type { MouseEvent, ReactNode } from "react"

const STYLE = "font-extrabold hover:underline"

const stay = (event: MouseEvent) => event.stopPropagation()

type RichLinkProps = {
  href: string
  external?: boolean
  children: ReactNode
}

export function RichLink({ href, external, children }: RichLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stay}
        className={STYLE}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={stay} className={STYLE}>
      {children}
    </Link>
  )
}
