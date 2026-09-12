import { separateFrom } from "./cache"

export function onBlocked({ user_id }: { user_id: string }): void {
  separateFrom(user_id)
}
