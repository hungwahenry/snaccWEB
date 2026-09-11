import { HOME_PATH } from "@/features/feed/routes"

export const profilePath = (username: string | null | undefined) =>
  username ? `/@${encodeURIComponent(username)}` : HOME_PATH
