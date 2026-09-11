import { describe, expect, it } from "vitest"
import type { AdminPage } from "../types"
import {
  draftFrom,
  isDraftReady,
  PAGE_STATUS,
  STATUS_CHANGE,
  toPageInput,
} from "./page"

const page = (patch: Partial<AdminPage> = {}): AdminPage => ({
  id: "p1",
  slug: "terms",
  title: "Terms",
  excerpt: null,
  content: { type: "doc" },
  html: "<p>Hello</p>",
  seo_title: "Terms of use",
  seo_description: null,
  status: "draft",
  published_at: null,
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
  ...patch,
})

describe("draftFrom", () => {
  it("starts empty for a new page and filled for an existing one", () => {
    expect(draftFrom()).toEqual({
      title: "",
      slug: "",
      excerpt: "",
      seoTitle: "",
      seoDescription: "",
      content: null,
      html: "",
    })
    expect(draftFrom(page())).toMatchObject({
      title: "Terms",
      slug: "terms",
      excerpt: "",
      seoTitle: "Terms of use",
      content: { type: "doc" },
      html: "<p>Hello</p>",
    })
  })
})

describe("isDraftReady", () => {
  const ready = draftFrom(page())

  it("needs a title, a slug and a body", () => {
    expect(isDraftReady(ready)).toBe(true)
    expect(isDraftReady({ ...ready, title: " " })).toBe(false)
    expect(isDraftReady({ ...ready, slug: "" })).toBe(false)
    expect(isDraftReady({ ...ready, html: "" })).toBe(false)
  })

  it("treats an empty paragraph as no body", () => {
    expect(isDraftReady({ ...ready, html: "<p></p>" })).toBe(false)
  })
})

describe("toPageInput", () => {
  it("trims and leaves out blank optional fields", () => {
    expect(
      toPageInput({
        ...draftFrom(page()),
        title: " Terms ",
        slug: " terms ",
        excerpt: "  ",
      })
    ).toEqual({
      title: "Terms",
      slug: "terms",
      content: { type: "doc" },
      html: "<p>Hello</p>",
      excerpt: undefined,
      seoTitle: "Terms of use",
      seoDescription: undefined,
    })
  })
})

describe("statuses", () => {
  it("flips a page between draft and published", () => {
    expect(STATUS_CHANGE.draft.next).toBe("published")
    expect(STATUS_CHANGE.published.next).toBe("draft")
    expect(STATUS_CHANGE.published.tone).toBe("destructive")
  })

  it("labels each status", () => {
    expect(PAGE_STATUS.published.label).toBe("published")
    expect(PAGE_STATUS.draft.label).toBe("draft")
  })
})
