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

export function upcomingImage(
  moments: readonly Pick<Playable, "image">[],
  index: number
): string | null {
  return moments[index + 1]?.image?.url ?? null
}
