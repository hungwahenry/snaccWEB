import { describe, expect, it } from "vitest"
import type { CampusImportRow, CampusImportTallies } from "../types"
import {
  applySummary,
  decisionChoices,
  importTitle,
  rowDraft,
  rowEdit,
} from "./campus-imports"

const ug = {
  id: "ug",
  name: "University of Ghana",
  acronym: "UG",
  slug: "ug",
  status: "verified" as const,
}

const row = (fields: Partial<CampusImportRow> = {}): CampusImportRow => ({
  id: "r1",
  position: 1,
  name: "University of Ghana",
  acronym: "UG",
  website: "https://ug.edu.gh",
  region_label: "Greater Accra",
  type_label: null,
  region: { id: "accra", name: "Greater Accra" },
  campus_type: null,
  time_zone: "Africa/Accra",
  ror_id: null,
  domains: [],
  match: "new",
  campus: null,
  merge_into: null,
  decision: "create",
  notes: [],
  ...fields,
})

const tallies = (
  fields: Partial<CampusImportTallies>
): CampusImportTallies => ({
  total: 0,
  new: 0,
  same: 0,
  similar: 0,
  undecided: 0,
  create: 0,
  update: 0,
  merge: 0,
  skip: 0,
  ...fields,
})

const values = (options: { value: string }[]) => options.map((o) => o.value)

describe("decisionChoices", () => {
  it("adds a new campus from a file, never one that is already ours", () => {
    expect(values(decisionChoices(row(), "file"))).toEqual([
      "undecided",
      "create",
      "skip",
    ])
    expect(
      values(decisionChoices(row({ match: "same", campus: ug }), "file"))
    ).toEqual(["undecided", "update", "skip"])
    expect(
      values(decisionChoices(row({ match: "similar", campus: ug }), "file"))
    ).toEqual(["undecided", "create", "update", "skip"])
  })

  it("merges only a campus already on Snacc that has a copy picked", () => {
    const own = row({ match: "similar", campus: ug })
    expect(values(decisionChoices(own, "existing"))).toEqual([
      "undecided",
      "update",
      "skip",
    ])
    expect(
      values(decisionChoices({ ...own, merge_into: ug }, "existing"))
    ).toEqual(["undecided", "update", "merge", "skip"])
  })
})

describe("rowEdit", () => {
  it("sends only what changed", () => {
    const original = row()
    expect(rowEdit(rowDraft(original), original)).toEqual({})
    expect(
      rowEdit(
        { ...rowDraft(original), acronym: " UoG ", website: "  " },
        original
      )
    ).toEqual({ acronym: "UoG", website: null })
  })

  it("clears a region and links a campus", () => {
    const original = row()
    expect(
      rowEdit(
        { ...rowDraft(original), regionId: "unset", campusId: "ug" },
        original
      )
    ).toEqual({ regionId: null, campusId: "ug" })
  })
})

describe("applySummary", () => {
  it("says what changes and what stays", () => {
    expect(
      applySummary(tallies({ create: 3, update: 1, merge: 2, skip: 2 }))
    ).toBe(
      "Applying adds 3 new campuses, updates 1 of ours and merges 2 copies, all at once. The other 2 rows stay as they are. This can't be undone."
    )
    expect(applySummary(tallies({ create: 1, undecided: 1 }))).toBe(
      "Applying adds 1 new campus, all at once. The other row stays as it is. This can't be undone."
    )
  })
})

describe("importTitle", () => {
  it("names a file by its file name and a re-check by its country", () => {
    const country = { code: "GH", name: "Ghana" }
    expect(
      importTitle({ source: "file", file_name: "ghana.csv", country })
    ).toBe("ghana.csv")
    expect(importTitle({ source: "existing", file_name: null, country })).toBe(
      "Ghana's campuses on Snacc"
    )
  })
})
