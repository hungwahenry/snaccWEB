export interface Country {
  code: string
  name: string
  currency: string
  open: boolean
}

export interface PlaceRegion {
  id: string
  parent_id: string | null
  slug: string
  name: string
}

export interface CampusType {
  id: string
  slug: string
  name: string
}

export interface CountryPlaces extends Country {
  regions: PlaceRegion[]
  campus_types: CampusType[]
}

export interface NamedPlace {
  id: string
  name: string
}

export interface RegionGroup {
  region: PlaceRegion | null
  members: PlaceRegion[]
}

export type GroupCoverage = "all" | "some" | "none"
