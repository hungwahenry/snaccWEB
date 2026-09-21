import { nameOf, type Named } from "@/features/users/utils/names"

export function friendsGoingLine(
  friends: Named[],
  count: number
): string | null {
  const [first, second] = friends.map((friend) => nameOf(friend))
  if (!first || count <= 0) return null
  if (count === 1) return `${first} is going`
  if (count === 2 && second) return `${first} and ${second} are going`

  const others = count - (second ? 2 : 1)
  const named = second ? `${first}, ${second}` : first
  return `${named} and ${others} ${others === 1 ? "other" : "others"} you follow are going`
}
