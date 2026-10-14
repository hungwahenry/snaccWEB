import { readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(__dirname, "..")
const SOURCE_DIRS = [
  "app",
  "components",
  "features",
  "hooks",
  "lib",
  "providers",
]

const LITERALS = [
  /\bNGN\b/,
  /₦/,
  /kobo/i,
  /naira/i,
  /nigeria/i,
  /\bLagos\b/,
  /\bBVN\b/,
  /\+234/,
  /en-NG/,
  /['"`]NG['"`]/,
  /\bWAT_TZ\b|common\/time\/wat\b|\bwat[A-Z]\w*/,
]

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sources(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [relative(ROOT, path)]
      : []
  })
}

function namesAPlace(file: string): boolean {
  const text = readFileSync(join(ROOT, file), "utf8")
  return LITERALS.some((literal) => literal.test(text))
}

const scanned = SOURCE_DIRS.flatMap((dir) => sources(join(ROOT, dir)))

describe("countries are data, never code", () => {
  it("names no country, currency or time zone", () => {
    expect(scanned.filter(namesAPlace)).toEqual([])
  })
})
