export type EggRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

export interface AdminEgg {
  id: string
  slug: string
  name: string
  description: string
  hint: string | null
  rarity: EggRarity
  color: string
  image_url: string | null
  enabled: boolean
  seeded: boolean
  trigger: unknown
  discoveries_count: number
}

export type EggTrigger = Record<string, unknown>

export interface CreateEggInput {
  slug: string
  name: string
  description: string
  hint?: string
  rarity: EggRarity
  color: string
  trigger?: EggTrigger
}

export interface UpdateEggInput {
  name?: string
  description?: string
  hint?: string
  color?: string
  enabled?: boolean
  trigger?: EggTrigger | null
}

export interface EggDraft {
  slug: string
  name: string
  description: string
  hint: string
  rarity: EggRarity
  color: string
  enabled: boolean
  trigger: string
}
