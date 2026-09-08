import { PencilIcon } from "lucide-react"
import Link from "next/link"
import { campusPath } from "@/features/campus/routes"
import { timeAgo } from "@/lib/format"
import type { SnaccAuthorUniversity } from "../../types"

type AuthorMetaProps = {
  university: SnaccAuthorUniversity | null
  createdAt: string
  editedAt?: string | null
  linkCampus?: boolean
}

export function AuthorMeta({
  university,
  createdAt,
  editedAt,
  linkCampus = true,
}: AuthorMetaProps) {
  return (
    <>
      {university ? (
        <>
          <Dot />
          {linkCampus ? (
            <Link
              href={campusPath(university.slug)}
              onClick={(event) => event.stopPropagation()}
              className="shrink truncate text-sm font-bold text-muted-foreground hover:underline"
            >
              {university.acronym}
            </Link>
          ) : (
            <span className="shrink truncate text-sm font-bold text-muted-foreground">
              {university.acronym}
            </span>
          )}
        </>
      ) : null}

      <Dot />
      <time
        dateTime={createdAt}
        className="shrink-0 text-sm text-muted-foreground"
      >
        {timeAgo(createdAt)}
      </time>

      {editedAt ? (
        <PencilIcon
          className="size-3 shrink-0 text-muted-foreground"
          aria-label="Edited"
        />
      ) : null}
    </>
  )
}

function Dot() {
  return <span className="shrink-0 text-sm text-muted-foreground">·</span>
}
