"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDate, handleOf } from "@/lib/format"
import type { AdminSnacc, SnaccAuthor } from "./types"

export function AuthorInline({
  author,
  note,
}: {
  author: SnaccAuthor
  note?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-8">
        <AvatarImage src={author.avatar_url} alt="" />
        <AvatarFallback>
          {(author.username ?? "?").slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <Link
          href={`/admin/users/${author.id}`}
          className="block truncate text-sm font-medium underline-offset-4 hover:underline"
        >
          {handleOf(author)}
        </Link>
        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  )
}

/** Media is the whole point of an admin view: an image post has no body to read. */
export function SnaccMedia({
  images,
  gif,
}: {
  images: { url: string }[]
  gif: { url: string } | null
}) {
  const urls = gif ? [gif.url] : images.map((image) => image.url)
  if (urls.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {urls.map((url) => (
        // eslint-disable-next-line @next/next/no-img-element -- user media on arbitrary hosts
        <img
          key={url}
          src={url}
          alt="Snacc media"
          className="max-h-72 rounded-lg border border-border object-contain"
        />
      ))}
    </div>
  )
}

/** The snacc as a moderator needs to see it. Shared by the snacc page and the report page. */
export function SnaccView({ snacc }: { snacc: AdminSnacc }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <AuthorInline
          author={snacc.author}
          note={formatDate(snacc.created_at)}
        />
        <div className="flex gap-2">
          {snacc.pinned ? <Badge variant="outline">Pinned</Badge> : null}
          {snacc.deleted_at ? (
            <Badge variant="destructive">Removed</Badge>
          ) : null}
        </div>
      </div>

      {snacc.body ? (
        <p className="text-sm whitespace-pre-wrap">{snacc.body}</p>
      ) : null}
      <SnaccMedia images={snacc.images} gif={snacc.gif} />

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>{snacc.reactions_count} reactions</span>
        <span>{snacc.comments_count} replies</span>
        <span>{snacc.resnaccs_count} resnaccs</span>
        <span>{snacc.views_count} views</span>
        <span>{snacc.reports_count} reports</span>
      </div>
    </div>
  )
}
