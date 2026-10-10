import Link from "next/link"
import { profilePath } from "@/features/users/routes"
import type { MentionedPerson } from "../utils/mentions"

export function MomentMentions({ people }: { people: MentionedPerson[] }) {
  if (people.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {people.map((person) => (
        <Link
          key={person.id}
          href={profilePath(person.username)}
          className="rounded-full border-2 border-white/70 bg-black/35 px-3 py-1.5 text-sm font-bold text-white transition-opacity active:opacity-70"
        >
          @{person.username}
        </Link>
      ))}
    </div>
  )
}
