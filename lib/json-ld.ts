export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdValue[]
  | { [key: string]: JsonLdValue }

export type JsonLd = { [key: string]: JsonLdValue }

const UNSAFE: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
}

export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (char) => UNSAFE[char]
  )
}

export function isoDuration(ms: number): string {
  return `PT${Math.max(0, Math.round(ms / 1000))}S`
}

export function counter(action: string, count: number): JsonLd {
  return {
    "@type": "InteractionCounter",
    interactionType: `https://schema.org/${action}`,
    userInteractionCount: Math.max(0, count),
  }
}
