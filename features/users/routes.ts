export const profilePath = (username: string | null | undefined) =>
  username ? `/@${username}` : "/home"
export const followsPath = (username: string, tab: "followers" | "following") =>
  `/follows/${username}?tab=${tab}`
