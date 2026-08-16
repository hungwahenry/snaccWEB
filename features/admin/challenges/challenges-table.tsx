"use client"

import { DataPagination } from "@/components/data-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Paginated } from "@/lib/api/types"
import { accentCss } from "./accent-field"
import { ChallengeDialog } from "./challenge-dialog"
import { ChallengeStatusAction } from "./challenge-status-action"
import type { useChallengeMutations } from "./use-challenges"
import type { AdminChallenge, ListChallengesParams } from "./types"

type Mutations = ReturnType<typeof useChallengeMutations>

const STATUS_VARIANT: Record<AdminChallenge["status"], "default" | "secondary" | "outline"> = {
  draft: "outline",
  active: "default",
  ended: "secondary",
}

function AccentSwatch({ challenge }: { challenge: AdminChallenge }) {
  return (
    <span
      className="size-3.5 shrink-0 rounded-full border"
      style={{ background: accentCss(challenge.accent_from, challenge.accent_to) }}
    />
  )
}

export function ChallengesTable({
  data,
  onParams,
  mutations,
}: {
  data: Paginated<AdminChallenge>
  params: ListChallengesParams
  onParams: (patch: Partial<ListChallengesParams>) => void
  mutations: Mutations
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ChallengeDialog mutations={mutations} trigger={<Button size="sm">New challenge</Button>} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Challenge</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Players</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-sm">
                No challenges yet.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell className="max-w-xs">
                  <div className="flex items-center gap-2">
                    <AccentSwatch challenge={challenge} />
                    <span className="font-medium">{challenge.title}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">#{challenge.tag}</div>
                </TableCell>
                <TableCell>{challenge.days}</TableCell>
                <TableCell>₦{(challenge.reward_kobo / 100).toLocaleString()}/day</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[challenge.status]}>{challenge.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {challenge.participant_count} · {challenge.completion_count} done
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <ChallengeStatusAction challenge={challenge} mutations={mutations} />
                  <ChallengeDialog
                    challenge={challenge}
                    mutations={mutations}
                    trigger={
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={mutations.remove.isPending}
                    onClick={() => mutations.remove.mutate(challenge.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DataPagination
        page={data.page}
        lastPage={data.last_page}
        total={data.total}
        onPage={(page) => onParams({ page })}
      />
    </div>
  )
}
