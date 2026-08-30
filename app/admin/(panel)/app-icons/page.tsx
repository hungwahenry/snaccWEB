"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { AppIconsView } from "@/features/admin/app-icons/components/app-icons-view"
import { useAppIcons } from "@/features/admin/app-icons/hooks/use-app-icons"

export default function AppIconsPage() {
  const query = useAppIcons()

  return (
    <>
      <PageHeader
        title="App icons"
        description="The artwork ships inside the app, so this decides which icons the picker offers, in what order, and under what name. Turning one off stops it being offered — it does not change the icon on the phone of anyone already using it."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load app icons.
        </p>
      ) : (
        <AppIconsView icons={query.data} />
      )}
    </>
  )
}
