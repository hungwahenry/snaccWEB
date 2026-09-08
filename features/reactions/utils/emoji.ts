export const QUICK_CATEGORY = "quick"

export type ReactionCategory =
  | "smileys_emotion"
  | "people_body"
  | "animals_nature"
  | "food_drink"
  | "activities"
  | "travel_places"
  | "objects"
  | "symbols"
  | "flags"

export type PickerCategory = typeof QUICK_CATEGORY | ReactionCategory

export interface ReactionEmoji {
  emoji: string
  name: string
  keywords: string[]
}

export interface Catalog {
  byCategory: Map<ReactionCategory, ReactionEmoji[]>
  all: ReactionEmoji[]
}

const QUICK_REACTIONS = [
  "👍",
  "❤️",
  "😂",
  "🤣",
  "😭",
  "🔥",
  "💀",
  "💯",
  "🙏",
  "😮",
  "👀",
  "🥺",
  "🥰",
  "😍",
  "😅",
  "😊",
  "😎",
  "🤔",
  "🤯",
  "🥳",
  "👏",
  "🙌",
  "💪",
  "🤝",
  "✅",
  "🎉",
  "💔",
  "😔",
  "😩",
  "🙄",
  "😤",
  "😬",
  "🤦",
  "🤷",
  "🫡",
  "😢",
  "😳",
  "😡",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
]

const QUICK: ReactionEmoji[] = QUICK_REACTIONS.map((emoji) => ({
  emoji,
  name: "",
  keywords: [],
}))

const GROUPS: Record<number, ReactionCategory> = {
  0: "smileys_emotion",
  1: "people_body",
  3: "animals_nature",
  4: "food_drink",
  5: "travel_places",
  6: "activities",
  7: "objects",
  8: "symbols",
  9: "flags",
}

interface CompactEmoji {
  unicode: string
  label: string
  tags?: string[]
  group?: number
  order?: number
}

let loaded: Catalog | null = null
let loading: Promise<Catalog> | null = null

export function catalogLoaded(): Catalog | null {
  return loaded
}

export function loadCatalog(): Promise<Catalog> {
  if (loaded) return Promise.resolve(loaded)
  if (loading) return loading

  loading = import("emojibase-data/en/compact.json").then((module) => {
    const rows = (module.default as CompactEmoji[])
      .filter((row) => row.group !== undefined && row.group in GROUPS)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    const byCategory = new Map<ReactionCategory, ReactionEmoji[]>()
    const all = rows.map((row) => {
      const emoji = {
        emoji: row.unicode,
        name: row.label,
        keywords: row.tags ?? [],
      }
      const key = GROUPS[row.group as number]
      byCategory.set(key, [...(byCategory.get(key) ?? []), emoji])
      return emoji
    })

    loaded = { byCategory, all }
    return loaded
  })

  return loading
}

function rank(emoji: ReactionEmoji, query: string): number {
  const name = emoji.name.toLowerCase()
  const keywords = emoji.keywords.map((keyword) => keyword.toLowerCase())

  if (name === query) return 0
  if (name.split(/[^a-z0-9]+/).some((word) => word.startsWith(query))) return 1
  if (keywords.includes(query)) return 2
  if (keywords.some((keyword) => keyword.startsWith(query))) return 3
  if (name.includes(query)) return 4
  if (keywords.some((keyword) => keyword.includes(query))) return 5

  return -1
}

export function searchEmojis(catalog: Catalog, query: string): ReactionEmoji[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const hits: { emoji: ReactionEmoji; rank: number; index: number }[] = []

  catalog.all.forEach((emoji, index) => {
    const hit = rank(emoji, needle)
    if (hit >= 0) hits.push({ emoji, rank: hit, index })
  })

  return hits
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((hit) => hit.emoji)
}

export function emojisFor(
  catalog: Catalog | null,
  category: PickerCategory
): ReactionEmoji[] {
  if (category === QUICK_CATEGORY) return QUICK
  return catalog?.byCategory.get(category) ?? []
}
