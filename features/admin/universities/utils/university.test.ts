import { describe, expect, it } from "vitest"
import type { AdminUniversity } from "../types"
import {
  acronymsById,
  campusOptions,
  draftFrom,
  isDraftReady,
  OWNERSHIP_CHOICES,
  STATE_CHOICES,
  toCreateInput,
  toUpdateInput,
  universityPlace,
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
  state: null,
  ownership: null,
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
    const draft = { ...draftFrom(), name: "Covenant", acronym: "CU" }
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

describe("state and ownership", () => {
  it("offers leaving each one unset first", () => {
    expect(STATE_CHOICES[0]).toEqual({ value: "unset", label: "Not set" })
    expect(STATE_CHOICES).toHaveLength(38)
    expect(OWNERSHIP_CHOICES.map((option) => option.label)).toEqual([
      "Not set",
      "Federal",
      "State",
      "Private",
    ])
  })

  it("starts unset and keeps what a campus already has", () => {
    expect(draftFrom()).toMatchObject({ state: "unset", ownership: "unset" })
    expect(
      draftFrom({
        ...campus("1", "University of Lagos", "UNILAG"),
        state: "lagos",
        ownership: "federal",
      })
    ).toMatchObject({ state: "lagos", ownership: "federal" })
  })

  it("clears an unset one on edit and leaves it out on create", () => {
    const draft = {
      ...draftFrom(campus("1", "Covenant", "CU")),
      state: "ogun" as const,
    }
    expect(toUpdateInput(draft)).toMatchObject({
      state: "ogun",
      ownership: null,
    })
    expect(toCreateInput({ ...draft, slug: "cu" })).toMatchObject({
      state: "ogun",
      ownership: undefined,
    })
  })

  it("reads where a campus is and who runs it", () => {
    expect(universityPlace({ state: "akwa_ibom", ownership: "state" })).toBe(
      "Akwa Ibom · State"
    )
    expect(universityPlace({ state: "fct", ownership: null })).toBe(
      "FCT (Abuja)"
    )
    expect(universityPlace({ state: null, ownership: "private" })).toBe(
      "Private"
    )
    expect(universityPlace({ state: null, ownership: null })).toBe("Not set")
  })
})
