export type PageStatus = "draft" | "published"

export interface AdminPage {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: unknown
  html: string
  seo_title: string | null
  seo_description: string | null
  status: PageStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface CreatePageInput {
  slug: string
  title: string
  content: unknown
  html: string
  excerpt?: string
  seoTitle?: string
  seoDescription?: string
  status?: PageStatus
}

export interface UpdatePageInput {
  slug?: string
  title?: string
  content?: unknown
  html?: string
  excerpt?: string
  seoTitle?: string
  seoDescription?: string
}

export interface PageDraft {
  title: string
  slug: string
  excerpt: string
  seoTitle: string
  seoDescription: string
  content: unknown
  html: string
}

export type PageTextKey =
  "title" | "slug" | "excerpt" | "seoTitle" | "seoDescription"

/** What publishing or unpublishing a page says, keyed by the status it has now. */
export interface PageStatusChange {
  action: string
  title: string
  description: string
  confirmLabel: string
  tone: "destructive" | "default"
  next: PageStatus
}
