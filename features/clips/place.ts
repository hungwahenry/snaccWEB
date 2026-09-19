interface Place {
  startId: string
  currentId: string
}

let place: Place | null = null

export function rememberPlace(startId: string, currentId: string): void {
  place = { startId, currentId }
}

export function placeIn(startId: string): string | null {
  return place?.startId === startId ? place.currentId : null
}

export function forgetPlace(): void {
  place = null
}
