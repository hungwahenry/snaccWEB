export const PIN_LENGTH = 6

export function typePin(current: string, key: string): string {
  if (key === "back") return current.slice(0, -1)
  if (!/^\d$/.test(key) || current.length >= PIN_LENGTH) return current
  return current + key
}

export type PinEntryOutcome =
  | { kind: "confirm"; first: string }
  | { kind: "mismatch"; error: string }
  | { kind: "save"; pin: string }

export function pinEntered(
  stage: "enter" | "confirm",
  first: string,
  entered: string
): PinEntryOutcome {
  if (stage === "enter") return { kind: "confirm", first: entered }
  if (entered !== first) {
    return { kind: "mismatch", error: "Those did not match. Start again." }
  }
  return { kind: "save", pin: entered }
}

export function pinDots(value: string): boolean[] {
  return Array.from({ length: PIN_LENGTH }, (_, index) => index < value.length)
}
