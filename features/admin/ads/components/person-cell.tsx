import Link from "next/link"
import { userPath } from "@/features/admin/shell/routes"
import { userName } from "@/features/admin/shell/utils/user"
import type { AdPerson } from "../types"
import { personNote } from "../utils/ads"

export function PersonCell({ person }: { person: AdPerson | null }) {
  if (!person) return <span className="text-sm text-muted-foreground">—</span>

  return (
    <div className="min-w-0">
      <Link
        href={userPath(person.id)}
        className="block truncate text-sm font-medium underline-offset-4 hover:underline"
      >
        {userName(person)}
      </Link>
      <p className="truncate text-xs text-muted-foreground">
        {personNote(person)}
      </p>
    </div>
  )
}
