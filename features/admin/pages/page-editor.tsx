"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "./rich-text-editor"
import type { usePageMutations } from "./use-pages"
import type { AdminPage } from "./types"

export function PageEditor({
  page,
  mutations,
}: {
  page?: AdminPage
  mutations: ReturnType<typeof usePageMutations>
}) {
  const [title, setTitle] = useState(page?.title ?? "")
  const [slug, setSlug] = useState(page?.slug ?? "")
  const [excerpt, setExcerpt] = useState(page?.excerpt ?? "")
  const [seoTitle, setSeoTitle] = useState(page?.seo_title ?? "")
  const [seoDescription, setSeoDescription] = useState(page?.seo_description ?? "")
  const [doc, setDoc] = useState<unknown>(page?.content ?? null)
  const [html, setHtml] = useState(page?.html ?? "")

  const editing = Boolean(page)
  const valid = title.trim() !== "" && slug.trim() !== "" && html.trim() !== "" && html !== "<p></p>"

  function save() {
    const shared = {
      title: title.trim(),
      slug: slug.trim(),
      content: doc,
      html,
      excerpt: excerpt.trim() || undefined,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
    }
    if (editing) {
      mutations.update.mutate(shared)
    } else {
      mutations.create.mutate(shared)
    }
  }

  const pending = mutations.create.isPending || mutations.update.isPending

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {editing && page && (
            <Button
              variant="outline"
              size="sm"
              disabled={mutations.setStatus.isPending}
              onClick={() =>
                mutations.setStatus.mutate({
                  pageId: page.id,
                  status: page.status === "published" ? "draft" : "published",
                })
              }
            >
              {page.status === "published" ? "Unpublish" : "Publish"}
            </Button>
          )}
        </div>
        <Button disabled={!valid || pending} onClick={save}>
          {editing ? "Save changes" : "Create page"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} />
        </Field>
        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            maxLength={100}
            placeholder="terms-of-use"
          />
        </Field>
      </div>

      <Field>
        <FieldLabel>Excerpt (optional)</FieldLabel>
        <Input
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          maxLength={300}
        />
      </Field>

      <Field>
        <FieldLabel>Body</FieldLabel>
        <RichTextEditor
          content={doc}
          onChange={(json, nextHtml) => {
            setDoc(json)
            setHtml(nextHtml)
          }}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>SEO title (optional)</FieldLabel>
          <Input
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            maxLength={200}
          />
        </Field>
        <Field>
          <FieldLabel>SEO description (optional)</FieldLabel>
          <Textarea
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            rows={2}
            maxLength={300}
          />
        </Field>
      </div>
    </div>
  )
}
