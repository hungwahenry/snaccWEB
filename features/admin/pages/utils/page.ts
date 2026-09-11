import type { StatusMeta } from "@/features/admin/shell/types"
import type {
  AdminPage,
  CreatePageInput,
  PageDraft,
  PageStatus,
  PageStatusChange,
} from "../types"

export const PAGE_LIMITS = {
  title: 200,
  slug: 100,
  excerpt: 300,
  seoTitle: 200,
  seoDescription: 300,
} as const

const EMPTY_BODY = "<p></p>"

export const PAGE_STATUS: Record<PageStatus, StatusMeta> = {
  published: { label: "published", variant: "secondary" },
  draft: { label: "draft", variant: "outline" },
}

export const STATUS_CHANGE: Record<PageStatus, PageStatusChange> = {
  published: {
    action: "Unpublish",
    title: "Take this page down?",
    description:
      "Anyone who opens the link will get a not-found instead. The draft is kept.",
    confirmLabel: "Unpublish",
    tone: "destructive",
    next: "draft",
  },
  draft: {
    action: "Publish",
    title: "Publish this page?",
    description:
      "It goes live on the site straight away, exactly as written here.",
    confirmLabel: "Publish it",
    tone: "default",
    next: "published",
  },
}

export function draftFrom(page?: AdminPage): PageDraft {
  return {
    title: page?.title ?? "",
    slug: page?.slug ?? "",
    excerpt: page?.excerpt ?? "",
    seoTitle: page?.seo_title ?? "",
    seoDescription: page?.seo_description ?? "",
    content: page?.content ?? null,
    html: page?.html ?? "",
  }
}

/** A page needs a title, a slug and a body with something in it. */
export function isDraftReady(draft: PageDraft): boolean {
  return (
    draft.title.trim() !== "" &&
    draft.slug.trim() !== "" &&
    draft.html.trim() !== "" &&
    draft.html !== EMPTY_BODY
  )
}

export function toPageInput(draft: PageDraft): CreatePageInput {
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    content: draft.content,
    html: draft.html,
    excerpt: draft.excerpt.trim() || undefined,
    seoTitle: draft.seoTitle.trim() || undefined,
    seoDescription: draft.seoDescription.trim() || undefined,
  }
}
