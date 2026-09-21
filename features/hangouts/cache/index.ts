import type { QueryKey } from "@tanstack/react-query"
import { patchSnacc, refreshSnacc } from "@/features/snaccs/cache"
import type { Author } from "@/features/users/types"
import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { allItems, filterItems, mapItems } from "@/lib/query/pages"
import type { HangoutCard, JoinState, SnaccHangout } from "../types"
import { withJoinState } from "../utils/join"
import { hangoutKeys } from "../utils/keys"

type CardPages = PaginatedPages<HangoutCard>

const client = () => getQueryClient()

function changeCards(
  change: (data: CardPages | undefined) => CardPages | undefined
): void {
  client().setQueriesData<CardPages>({ queryKey: hangoutKeys.lists() }, change)
}

function listsHold(snaccIds: readonly string[]): boolean {
  return client()
    .getQueriesData<CardPages>({ queryKey: hangoutKeys.lists() })
    .some(([, data]) =>
      allItems(data).some((card) => snaccIds.includes(card.snacc.id))
    )
}

export function patchHangout(
  snaccId: string,
  patch: (hangout: SnaccHangout) => SnaccHangout
): void {
  patchSnacc(snaccId, (snacc) =>
    snacc.hangout ? { ...snacc, hangout: patch(snacc.hangout) } : snacc
  )
  changeCards((data) =>
    mapItems(data, (card) =>
      card.snacc.id === snaccId && card.snacc.hangout
        ? {
            ...card,
            snacc: { ...card.snacc, hangout: patch(card.snacc.hangout) },
          }
        : card
    )
  )
}

export function setJoinState(snaccId: string, next: JoinState): void {
  patchHangout(snaccId, (hangout) => withJoinState(hangout, next))
}

export function dropHangouts(snaccIds: readonly string[]): void {
  changeCards((data) =>
    filterItems(data, (card) => !snaccIds.includes(card.snacc.id))
  )
}

export function hangoutListsChanged(): void {
  void client().invalidateQueries({ queryKey: hangoutKeys.lists() })
}

export function refreshHangoutLists(snaccIds: readonly string[]): void {
  if (listsHold(snaccIds)) hangoutListsChanged()
}

export function placeChanged(snaccId: string, next: JoinState): void {
  setJoinState(snaccId, next)
  refreshSnacc(snaccId)
  hangoutListsChanged()
}

export function dropPerson(key: QueryKey, userId: string): void {
  client().setQueryData<PaginatedPages<Author>>(key, (data) =>
    filterItems(data, (person) => person.id !== userId)
  )
}

export function peopleChanged(snaccId: string): void {
  void client().invalidateQueries({ queryKey: hangoutKeys.members(snaccId) })
  void client().invalidateQueries({ queryKey: hangoutKeys.requests(snaccId) })
  refreshSnacc(snaccId)
  refreshHangoutLists([snaccId])
}
