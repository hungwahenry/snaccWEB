export const momentsPath = (authorId: string) => `/moments/${authorId}`
export const NEW_MOMENT_PATH = "/moments/new"
export const shareToMomentPath = (snaccId: string) =>
  `${NEW_MOMENT_PATH}?snacc=${encodeURIComponent(snaccId)}`
