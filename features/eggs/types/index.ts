export type EggRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

export interface DiscoveredEgg {
  id: string
  slug: string
  name: string
  description: string
  rarity: EggRarity
  color: string
  image_url: string | null
  found_percent: number
  discovered_at: string
}

/**
 * A hidden egg, as far as the viewer is concerned. The app's version carries the trigger that
 * arms it; the web only lists them, so the trigger is deliberately not modelled here.
 */
export interface EggStub {
  id: string
  rarity: EggRarity
  color: string
  hint: string | null
  found_percent: number
}

export interface EggCollection {
  discovered: DiscoveredEgg[]
  undiscovered: EggStub[]
  total: number
}
