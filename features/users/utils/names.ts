export interface Named {
  display_name: string | null
  username: string | null
}

/** The name to show for someone: what they call themselves, else their username. */
export function nameOf(person: Named, fallback = "Someone"): string {
  return person.display_name || person.username || fallback
}

export function handleOf(person: Pick<Named, "username">): string | null {
  return person.username ? `@${person.username}` : null
}

/** Their name, or Ghost for anything posted anonymously. */
export function authorNameOf(
  person: Named,
  anonymous: boolean,
  fallback?: string
): string {
  return anonymous ? "Ghost" : nameOf(person, fallback)
}
