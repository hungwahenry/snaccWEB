import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { plural } from "@/features/admin/shell/utils/format"
import type { AdminUniversity } from "@/features/admin/universities/types"
import {
  campusOptions,
  placeChoice,
  placeOf,
} from "@/features/admin/universities/utils/university"
import type {
  CampusImport,
  CampusImportDecision,
  CampusImportMatch,
  CampusImportRow,
  CampusImportRowEdit,
  CampusImportSource,
  CampusImportStatus,
  CampusImportTallies,
  ImportRowDraft,
} from "../types"

export const IMPORT_POLL_MS = 3_000

const NO_CAMPUS = "none"

export function linkChoice(id: string | null): string {
  return id ?? NO_CAMPUS
}

export function linkOf(choice: string): string | null {
  return choice === NO_CAMPUS ? null : choice
}

export function linkOptions(
  campuses: Option[],
  noneLabel: string,
  exceptId?: string
): Option[] {
  return [
    { value: NO_CAMPUS, label: noneLabel },
    ...campuses.filter((campus) => campus.value !== exceptId),
  ]
}

export const IMPORT_STATUS: Record<CampusImportStatus, StatusMeta> = {
  checking: { label: "Checking", variant: "secondary" },
  ready: { label: "Waiting for review", variant: "default" },
  applied: { label: "Applied", variant: "outline" },
  failed: { label: "Check failed", variant: "destructive" },
}

export const MATCH: Record<CampusImportMatch, StatusMeta> = {
  new: { label: "New", variant: "default" },
  same: { label: "Already on Snacc", variant: "secondary" },
  similar: { label: "Looks like one of ours", variant: "outline" },
}

export const DECISION_LABEL: Record<CampusImportDecision, string> = {
  undecided: "Not decided",
  create: "Add as new",
  update: "Update ours",
  merge: "Merge",
  skip: "Leave out",
}

export const MATCHES = [
  "new",
  "same",
  "similar",
] as const satisfies readonly CampusImportMatch[]

export const DECISIONS = [
  "undecided",
  "create",
  "update",
  "merge",
  "skip",
] as const satisfies readonly CampusImportDecision[]

export const MATCH_OPTIONS: Option<CampusImportMatch>[] = MATCHES.map(
  (match) => ({ value: match, label: MATCH[match].label })
)

export const DECISION_OPTIONS: Option<CampusImportDecision>[] = DECISIONS.map(
  (decision) => ({ value: decision, label: DECISION_LABEL[decision] })
)

export function importTitle(
  run: Pick<CampusImport, "source" | "file_name" | "country">
): string {
  return run.source === "file"
    ? (run.file_name ?? "Uploaded file")
    : `${run.country.name}'s campuses on Snacc`
}

export function startedBy(run: Pick<CampusImport, "created_by">): string {
  if (!run.created_by) return "by an admin who has left"
  return run.created_by.username
    ? `by @${run.created_by.username}`
    : "by an admin"
}

export function importPoll(statuses: CampusImportStatus[]): number | false {
  return statuses.includes("checking") ? IMPORT_POLL_MS : false
}

export function importCampusOptions(
  campuses: AdminUniversity[],
  countryCode: string | undefined
): Option[] {
  return campusOptions(
    campuses.filter(
      (campus) =>
        campus.country.code === countryCode && campus.status !== "rejected"
    )
  )
}

export function decisionChoices(
  row: Pick<CampusImportRow, "match" | "campus" | "merge_into">,
  source: CampusImportSource
): Option<CampusImportDecision>[] {
  const allowed: CampusImportDecision[] = ["undecided"]
  if (source === "file" && row.match !== "same") allowed.push("create")
  if (row.campus) allowed.push("update")
  if (row.merge_into) allowed.push("merge")
  allowed.push("skip")

  return allowed.map((decision) => ({
    value: decision,
    label: DECISION_LABEL[decision],
  }))
}

export function applyCount(rows: CampusImportTallies): number {
  return rows.create + rows.update + rows.merge
}

function sentenceList(parts: string[]): string {
  return parts.length > 1
    ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`
    : (parts[0] ?? "")
}

export function applySummary(rows: CampusImportTallies): string {
  const changes = [
    rows.create
      ? `adds ${plural(rows.create, "new campus", "new campuses")}`
      : null,
    rows.update ? `updates ${plural(rows.update, "of ours", "of ours")}` : null,
    rows.merge ? `merges ${plural(rows.merge, "copy", "copies")}` : null,
  ].filter((part): part is string => part !== null)
  const left = rows.undecided + rows.skip

  return [
    `Applying ${sentenceList(changes)}, all at once.`,
    left === 1 ? "The other row stays as it is." : null,
    left > 1 ? `The other ${plural(left, "row")} stay as they are.` : null,
    "This can't be undone.",
  ]
    .filter((part): part is string => part !== null)
    .join(" ")
}

export function rowLine(
  row: Pick<CampusImportRow, "acronym" | "website">
): string {
  return [row.acronym, row.website]
    .filter((part): part is string => Boolean(part))
    .join(" · ")
}

export function rowPlace(
  row: Pick<CampusImportRow, "region" | "campus_type" | "time_zone">
): string {
  return [row.region?.name, row.campus_type?.name, row.time_zone]
    .filter((part): part is string => Boolean(part))
    .join(" · ")
}

export function fileSaid(
  row: Pick<CampusImportRow, "region_label" | "type_label">
): string | null {
  const labels = [row.region_label, row.type_label].filter(
    (label): label is string => Boolean(label)
  )
  return labels.length ? `The file said: ${labels.join(", ")}.` : null
}

export function rowDraft(row: CampusImportRow): ImportRowDraft {
  return {
    name: row.name,
    acronym: row.acronym ?? "",
    website: row.website ?? "",
    regionId: placeChoice(row.region?.id),
    campusTypeId: placeChoice(row.campus_type?.id),
    timeZone: row.time_zone ?? "",
    campusId: row.campus?.id ?? null,
    mergeIntoId: row.merge_into?.id ?? null,
  }
}

export function isRowDraftReady(draft: ImportRowDraft): boolean {
  return draft.name.trim().length >= 2 && draft.acronym.trim() !== ""
}

export function rowEdit(
  draft: ImportRowDraft,
  row: CampusImportRow
): CampusImportRowEdit {
  const edit: CampusImportRowEdit = {}
  const name = draft.name.trim()
  const acronym = draft.acronym.trim()
  const website = draft.website.trim() || null
  const regionId = placeOf(draft.regionId)
  const campusTypeId = placeOf(draft.campusTypeId)

  if (name !== row.name) edit.name = name
  if (acronym !== (row.acronym ?? "")) edit.acronym = acronym
  if (website !== row.website) edit.website = website
  if (regionId !== (row.region?.id ?? null)) edit.regionId = regionId
  if (campusTypeId !== (row.campus_type?.id ?? null)) {
    edit.campusTypeId = campusTypeId
  }
  if (draft.timeZone && draft.timeZone !== row.time_zone) {
    edit.timeZone = draft.timeZone
  }
  if (draft.campusId !== (row.campus?.id ?? null))
    edit.campusId = draft.campusId
  if (draft.mergeIntoId !== (row.merge_into?.id ?? null)) {
    edit.mergeIntoId = draft.mergeIntoId
  }

  return edit
}
