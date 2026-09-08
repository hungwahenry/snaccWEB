export const MOMENTS_TRAY_KEY = ["moments", "tray"]
export const authorMomentsKey = (authorId: string) => [
  "moments",
  "author",
  authorId,
]
export const momentViewersKey = (momentId: string) => [
  "moments",
  "viewers",
  momentId,
]
