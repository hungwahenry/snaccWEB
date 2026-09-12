"use client"

import { GraduationCapIcon, ShareIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { ShareSheet } from "@/features/share/components/share-sheet"
import { SnaccListScreen } from "@/features/snaccs/screens/snacc-list-screen"
import { CampusHeader } from "../components/campus-header"
import { CampusHeaderSkeleton } from "../components/campus-header-skeleton"
import { useCampusScreen } from "../hooks/use-campus-screen"

export function CampusScreen({ slug }: { slug: string }) {
  const screen = useCampusScreen(slug)

  return (
    <>
      <SnaccListScreen
        title={screen.title}
        right={
          screen.shareCampus ? (
            <IconButton
              icon={ShareIcon}
              label="Share campus"
              onClick={screen.shareCampus}
            />
          ) : undefined
        }
        header={
          screen.campus ? (
            <CampusHeader campus={screen.campus} />
          ) : screen.headerLoading ? (
            <CampusHeaderSkeleton />
          ) : null
        }
        list={screen.list}
        failedTitle="Could not load this campus"
        empty={{
          icon: GraduationCapIcon,
          title: "No snaccs yet",
          description: screen.emptyDescription,
        }}
      />
      <ShareSheet {...screen.shareSheet} />
    </>
  )
}
