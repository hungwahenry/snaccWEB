"use client"

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { PageEditor } from "@/features/admin/pages/page-editor"
import { usePage, usePageMutations } from "@/features/admin/pages/use-pages"

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const query = usePage(id)
  const mutations = usePageMutations(id)

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-4 w-fit" render={<Link href="/admin/pages" />}>
        ← Back to pages
      </Button>
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load this page.</p>
      ) : (
        <PageEditor page={query.data} mutations={mutations} />
      )}
    </>
  )
}
