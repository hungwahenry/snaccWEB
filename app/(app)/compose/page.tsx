import type { Metadata } from "next"
import { ComposeScreen } from "@/features/snaccs/screens/compose-screen"
import { EditSnaccScreen } from "@/features/snaccs/screens/edit-snacc-screen"
import { requireSession } from "@/lib/auth-server"

export const metadata: Metadata = { title: "New snacc" }

type Props = {
  searchParams: Promise<{
    parentId?: string
    resnaccOfId?: string
    initialBody?: string
    matchId?: string
    edit?: string
    draft?: string
  }>
}

export default async function ComposePage({ searchParams }: Props) {
  await requireSession("/compose")
  const { parentId, resnaccOfId, initialBody, matchId, edit, draft } =
    await searchParams

  if (edit) return <EditSnaccScreen id={edit} />

  return (
    <ComposeScreen
      key={`${parentId ?? ""}:${resnaccOfId ?? ""}:${draft ?? ""}`}
      parentId={parentId || undefined}
      resnaccOfId={resnaccOfId || undefined}
      initialBody={initialBody || undefined}
      matchId={matchId || undefined}
      draftId={draft || undefined}
    />
  )
}
