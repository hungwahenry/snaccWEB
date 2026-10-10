import type { MentionEntity } from "@/features/users/types"

export interface MentionedPerson {
  id: string
  username: string
}

export function mentionedPeople(entities: MentionEntity[]): MentionedPerson[] {
  const people = new Map<string, MentionedPerson>()
  for (const { user } of entities) {
    if (user.username && !people.has(user.id)) {
      people.set(user.id, { id: user.id, username: user.username })
    }
  }
  return [...people.values()]
}
