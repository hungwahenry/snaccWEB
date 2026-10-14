export interface AdminCountry {
  code: string
  name: string
  currency: string
  open: boolean
  min_age: number
  campuses: number
}

export interface AdminRegion {
  id: string
  name: string
  slug: string
  parent_id: string | null
  campuses: number
  promotions: number
  regions: number
}

export interface AdminCampusType {
  id: string
  name: string
  slug: string
  position: number
  campuses: number
  promotions: number
}

export interface CountryPlaces {
  regions: AdminRegion[]
  campus_types: AdminCampusType[]
}

export interface RegionInput {
  name: string
  parentId: string | null
}

export interface CampusTypeInput {
  name: string
  position?: number
}

export interface CampusTypeDraft {
  name: string
  position: string
}
