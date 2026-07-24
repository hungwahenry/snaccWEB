"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageEditor } from "@/features/admin/pages/page-editor"
import { usePageMutations } from "@/features/admin/pages/use-pages"

export default function NewPagePage() {
  const mutations = usePageMutations()

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-4 w-fit" render={<Link href="/admin/pages" />}>
        ← Back to pages
      </Button>
      <PageEditor mutations={mutations} />
    </>
  )
}
