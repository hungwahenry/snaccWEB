interface Named {
  username: string | null
  display_name?: string | null
  email?: string | null
}

/** What to call someone: their display name, else their handle, else their email. */
export function userName(user: Named): string {
  return (
    user.display_name?.trim() ||
    (user.username ? `@${user.username}` : null) ||
    user.email ||
    "Unnamed"
  )
}

/** Their @handle, falling back to their email for accounts that never picked one. */
export function userHandle(user: Named): string {
  if (user.username) return `@${user.username}`

  return user.email || "No username"
}

/** The text an avatar takes its initial from. */
export function userInitialSource(user: Named): string {
  return user.display_name?.trim() || user.username || user.email || "?"
}
