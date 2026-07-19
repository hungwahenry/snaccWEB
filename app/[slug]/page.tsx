import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { getPublicPage } from "@/lib/pages"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPublicPage(slug)
  if (!page) return {}
  return {
    title: page.seo_title ?? page.title,
    description: page.seo_description ?? page.excerpt ?? undefined,
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPublicPage(slug)
  if (!page) notFound()

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">{page.title}</h1>
        {page.published_at ? (
          <p className="text-muted-foreground mt-2 text-sm">
            Updated{" "}
            {new Date(page.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
        <article className="snacc-prose mt-8" dangerouslySetInnerHTML={{ __html: page.html }} />
      </main>

      <SiteFooter />
    </div>
  )
}
