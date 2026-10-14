import { describe, expect, it } from "vitest"
import type { CountryPlaces } from "@/features/places/types"
import type { AdminUniversity } from "../types"
import {
  acronymsById,
  campusOptions,
  campusTypeChoices,
  draftFrom,
  isDraftReady,
  regionChoices,
  toCreateInput,
  toUpdateInput,
  universityPlace,
  withCountry,
  timeZoneOptions,
  ANY_CAMPUS,
  campusSearchOptions,
} from "./university"

const campus = (
  id: string,
  name: string,
  acronym: string
): AdminUniversity => ({
  id,
  name,
  acronym,
  slug: acronym.toLowerCase(),
  motto: null,
  website: null,
  logo_url: null,
  country: { code: "GH", name: "Ghana" },
  region: null,
  campus_type: null,
  time_zone: "Africa/Accra",
  open: true,
  status: "verified",
  ror_id: null,
  domains: [],
  added_by: null,
  created_at: "2026-10-01T00:00:00.000Z",
  stats: { profiles: 0, snaccs: 0 },
  fund: null,
})

describe("campusOptions", () => {
  it("lists campuses by name with their acronym", () => {
    expect(
      campusOptions([
        campus("2", "University of Lagos", "UNILAG"),
        campus("1", "Covenant University", "CU"),
      ])
    ).toEqual([
      { value: "1", label: "Covenant University (CU)" },
      { value: "2", label: "University of Lagos (UNILAG)" },
    ])
  })
})

describe("acronymsById", () => {
  it("maps ids to acronyms", () => {
    expect(acronymsById([campus("1", "Covenant", "CU")]).get("1")).toBe("CU")
  })
})

describe("drafts", () => {
  it("starts empty for a new campus and filled for an existing one", () => {
    expect(draftFrom().name).toBe("")
    const draft = draftFrom({
      ...campus("1", "Covenant", "CU"),
      motto: "Raising",
    })
    expect(draft).toMatchObject({
      name: "Covenant",
      slug: "cu",
      motto: "Raising",
    })
  })

  it("needs a slug only when creating", () => {
    const draft = {
      ...draftFrom(),
      name: "Covenant",
      acronym: "CU",
      countryCode: "GH",
      timeZone: "Africa/Accra",
    }
    expect(isDraftReady(draft, false)).toBe(false)
    expect(isDraftReady(draft, true)).toBe(true)
    expect(isDraftReady({ ...draft, slug: "cu" }, false)).toBe(true)
  })

  it("sends a cleared field on edit so it actually clears", () => {
    const draft = { ...draftFrom(campus("1", "Covenant", "CU")), motto: "  " }
    expect(toUpdateInput(draft).motto).toBe("")
    expect(toCreateInput(draft).motto).toBeUndefined()
  })

  it("lowercases the slug on create", () => {
    const draft = {
      ...draftFrom(),
      name: "X",
      acronym: "X",
      slug: " New-Campus ",
    }
    expect(toCreateInput(draft).slug).toBe("new-campus")
  })
})

const GHANA: CountryPlaces = {
  code: "GH",
  name: "Ghana",
  currency: "GHS",
  open: false,
  regions: [
    { id: "r1", parent_id: null, slug: "southern", name: "Southern" },
    { id: "r2", parent_id: "r1", slug: "accra", name: "Greater Accra" },
  ],
  campus_types: [{ id: "t1", slug: "public", name: "Public" }],
}

describe("place", () => {
  it("offers leaving region and campus type unset first", () => {
    expect(regionChoices(GHANA)).toEqual([
      { value: "unset", label: "Not set" },
      { value: "r1", label: "Southern" },
      { value: "r2", label: "Southern › Greater Accra" },
    ])
    expect(campusTypeChoices(GHANA).map((option) => option.label)).toEqual([
      "Not set",
      "Public",
    ])
    expect(regionChoices(undefined)).toHaveLength(1)
  })

  it("needs a country and a time zone", () => {
    const draft = { ...draftFrom(), name: "UG", acronym: "UG", slug: "ug" }
    expect(isDraftReady(draft, false)).toBe(false)
    expect(
      isDraftReady(
        { ...draft, countryCode: "GH", timeZone: "Africa/Accra" },
        false
      )
    ).toBe(true)
  })

  it("forgets the region and type when the country changes", () => {
    const draft = {
      ...draftFrom(campus("1", "University of Ghana", "UG")),
      regionId: "r2",
      campusTypeId: "t1",
    }
    expect(withCountry(draft, "GH")).toBe(draft)
    expect(withCountry(draft, "KE")).toMatchObject({
      countryCode: "KE",
      regionId: "unset",
      campusTypeId: "unset",
    })
  })

  it("sends an unset region and type as null", () => {
    const draft = draftFrom(campus("1", "University of Ghana", "UG"))
    expect(toUpdateInput({ ...draft, regionId: "r2" })).toMatchObject({
      countryCode: "GH",
      regionId: "r2",
      campusTypeId: null,
      timeZone: "Africa/Accra",
      open: true,
    })
  })

  it("reads where a campus is", () => {
    expect(
      universityPlace({
        country: { code: "GH", name: "Ghana" },
        region: { id: "r2", name: "Greater Accra" },
        campus_type: { id: "t1", name: "Public" },
        open: true,
      })
    ).toBe("Greater Accra · Public · Ghana")
    expect(
      universityPlace({
        country: { code: "GH", name: "Ghana" },
        region: null,
        campus_type: null,
        open: false,
      })
    ).toBe("Ghana · Not open")
  })
})

describe("timeZoneOptions", () => {
  it("keeps a stored zone the browser does not list, so it still shows", () => {
    expect(timeZoneOptions("Mars/Olympus")[0]).toEqual({
      value: "Mars/Olympus",
      label: "Mars/Olympus",
    })
    expect(
      timeZoneOptions("Africa/Lagos").filter(
        (option) => option.value === "Africa/Lagos"
      )
    ).toHaveLength(1)
  })
})

describe("campusSearchOptions", () => {
  const campus = (id: string, acronym: string, country: string, open = true) =>
    ({
      id,
      name: `${acronym} University`,
      acronym,
      slug: id,
      country_code: country,
      status: "verified",
      open,
      motto: null,
      website: null,
      logo_url: null,
    }) as const

  it("names the country, drops repeats and can lead with an any choice", () => {
    expect(
      campusSearchOptions(
        [
          campus("a", "UI", "NG"),
          campus("b", "UI", "ID", false),
          campus("a", "UI", "NG"),
        ],
        "Every campus"
      )
    ).toEqual([
      { value: ANY_CAMPUS, label: "Every campus" },
      { value: "a", label: "UI University (UI) · NG" },
      { value: "b", label: "UI University (UI) · ID · not open yet" },
    ])
  })
})
