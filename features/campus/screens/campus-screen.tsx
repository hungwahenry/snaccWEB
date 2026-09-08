"use client"

import { GraduationCapIcon, ShareIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { ShareSheet } from "@/features/share/components/share-sheet"
import { useShare } from "@/features/share/hooks/use-share"
import { SnaccListScreen } from "@/features/snaccs/screens/snacc-list-screen"
import { CampusHeader, CampusHeaderSkeleton } from "../components/campus-header"
import { useCampusSnaccs } from "../hooks/use-campus-snaccs"
import { useUniversity } from "../hooks/use-university"

export function CampusScreen({ slug }: { slug: string }) {
  const list = useCampusSnaccs(slug)
  const university = useUniversity(slug)
  const share = useShare()
  const title = university.data?.acronym ?? "Campus"

  return (
    <>
      <SnaccListScreen
        title={title}
        right={
          university.data ? (
            <IconButton
              icon={ShareIcon}
              label="Share campus"
              onClick={() =>
                share.open({ kind: "campus", university: university.data! })
              }
            />
          ) : undefined
        }
        header={
          university.data ? (
            <CampusHeader campus={university.data} />
          ) : university.isPending ? (
            <CampusHeaderSkeleton />
          ) : null
        }
        list={list}
        failedTitle="Could not load this campus"
        empty={{
          icon: GraduationCapIcon,
          title: "No snaccs yet",
          description: `Nothing from ${title} yet.`,
        }}
      />
      <ShareSheet {...share.sheet} />
    </>
  )
}
