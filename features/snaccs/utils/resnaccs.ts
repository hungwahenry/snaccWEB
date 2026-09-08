import type { EmbeddedSnacc, Snacc } from "../types"

export function isPlainResnacc(snacc: Snacc): boolean {
  return (
    snacc.resnacc_of !== null &&
    !snacc.body &&
    snacc.images.length === 0 &&
    !snacc.gif
  )
}

export function asSnacc(embedded: EmbeddedSnacc): Snacc {
  return { ...embedded, resnacc_of: null, quoted_gone: null }
}

export function toEmbedded(snacc: Snacc): EmbeddedSnacc {
  const embedded: Partial<Snacc> = { ...snacc }
  delete embedded.resnacc_of
  delete embedded.quoted_gone
  return embedded as EmbeddedSnacc
}
