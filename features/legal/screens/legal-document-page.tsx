import { notFound } from "next/navigation"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { longDate } from "@/lib/format"
import { getLegalDocument } from "../api/public"
import type { LegalKind } from "../types"

export async function LegalDocumentPage({
  kind,
  country,
}: {
  kind: LegalKind
  country: string | null
}) {
  const doc = await getLegalDocument(kind, country)
  if (!doc) notFound()

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          {doc.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Version {doc.version}
          {doc.published_at
            ? ` · Updated ${longDate(doc.published_at, "UTC")}`
            : null}
        </p>
        <article
          className="snacc-prose mt-8"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </main>

      <SiteFooter />
    </div>
  )
}
