interface Playable {
  id: string
  image: { url: string } | null
}

export function isReady(
  moment: Playable,
  loaded: ReadonlySet<string>
): boolean {
  return !moment.image || loaded.has(moment.id)
}

export function openingIndex(moments: readonly { seen: boolean }[]): number {
  const first = moments.findIndex((moment) => !moment.seen)
  return first === -1 ? 0 : first
}

export function openingImage(
  moments: readonly (Pick<Playable, "image"> & { seen: boolean })[]
): string | null {
  return moments[openingIndex(moments)]?.image?.url ?? null
}

export function upcomingImage(
  moments: readonly Pick<Playable, "image">[],
  index: number
): string | null {
  return moments[index + 1]?.image?.url ?? null
}
