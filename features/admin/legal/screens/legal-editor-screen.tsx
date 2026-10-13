"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { LEGAL_PATH } from "@/features/admin/shell/routes"
import { longDate } from "@/lib/format"
import { LegalEditor } from "../components/legal-editor"
import { useLegalEditorScreen } from "../hooks/use-legal-editor-screen"
import { whereLabel } from "@/features/admin/shell/utils/where"

export function LegalEditorScreen({ id }: { id: string }) {
  const screen = useLegalEditorScreen(id)

  return (
    <>
      <BackLink href={LEGAL_PATH} label="Back to legal" />
      <QueryView query={screen.query} what="this document">
        {(doc) => (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-semibold">
                {doc.title}, version {doc.version}
              </h1>
              <p className="text-sm text-muted-foreground">
                {whereLabel(doc.country_code, screen.countryNames)}
                {doc.published_at
                  ? ` · Published ${longDate(doc.published_at)}`
                  : " · Draft"}
              </p>
            </div>

            {doc.published_at ? (
              <article
                className="snacc-prose"
                dangerouslySetInnerHTML={{ __html: doc.html }}
              />
            ) : (
              <LegalEditor
                doc={doc}
                draft={screen.draft}
                title={screen.text("title")}
                canSave={screen.ready}
                onBodyChange={screen.setBody}
                onSave={screen.save}
                onPublish={screen.publish}
                onDelete={screen.remove}
              />
            )}
          </div>
        )}
      </QueryView>
    </>
  )
}
