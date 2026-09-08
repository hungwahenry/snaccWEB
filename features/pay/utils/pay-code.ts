import { create } from "qrcode"

export interface PayCodeMatrix {
  size: number
  dark: (row: number, col: number) => boolean
}

const FINDER = 7

export function payCodeMatrix(value: string): PayCodeMatrix {
  const { modules } = create(value, { errorCorrectionLevel: "H" })
  return { size: modules.size, dark: (row, col) => modules.get(row, col) === 1 }
}

export function inFinder(row: number, col: number, size: number): boolean {
  const top = row < FINDER
  const left = col < FINDER
  const bottom = row >= size - FINDER
  const right = col >= size - FINDER
  return (top && left) || (top && right) || (bottom && left)
}

export function finderOrigins(size: number): [number, number][] {
  return [
    [0, 0],
    [0, size - FINDER],
    [size - FINDER, 0],
  ]
}
