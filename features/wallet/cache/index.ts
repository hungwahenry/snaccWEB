import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { mapItems } from "@/lib/query/pages"
import type {
  MoneyRequest,
  MoneyRequestStatus,
  RequestMute,
  VirtualAccount,
  WalletOverview,
  WalletRecipient,
} from "../types"
import { walletKeys } from "../utils/keys"

/** Money moved: everything counted from the ledger refetches, a top-up being waited on included. */
export function moneyMoved(): void {
  const queryClient = getQueryClient()
  void queryClient.invalidateQueries({
    queryKey: walletKeys.transactionLists(),
  })
  void queryClient.invalidateQueries({ queryKey: walletKeys.summaries() })
  void queryClient.invalidateQueries({ queryKey: walletKeys.recipients() })
  void queryClient.invalidateQueries({ queryKey: walletKeys.limits() })
  void queryClient.invalidateQueries({ queryKey: walletKeys.deposits() })
}

/** The wallet as the server now has it, or, without one, a sign that it changed out of sight. */
export function walletChanged(overview?: WalletOverview): void {
  const queryClient = getQueryClient()
  if (overview) {
    queryClient.setQueryData<WalletOverview>(walletKeys.overview(), overview)
  } else {
    void queryClient.invalidateQueries({ queryKey: walletKeys.overview() })
  }
  moneyMoved()
}

/** A pushed balance: the number moves at once, and whatever is counted from it refetches. */
export function balanceChanged(balance: number): void {
  getQueryClient().setQueryData<WalletOverview>(walletKeys.overview(), (old) =>
    old ? { ...old, balance } : old
  )
  moneyMoved()
}

/** A bank send moved on, so its receipt's delivery timeline is out of date too. */
export function payoutChanged(): void {
  walletChanged()
  void getQueryClient().invalidateQueries({
    queryKey: walletKeys.transactionDetails(),
  })
}

export function pinChanged(): void {
  void getQueryClient().invalidateQueries({ queryKey: walletKeys.overview() })
}

export function requestsChanged(): void {
  void getQueryClient().invalidateQueries({
    queryKey: walletKeys.requestLists(),
  })
}

export function mutesChanged(): void {
  void getQueryClient().invalidateQueries({ queryKey: walletKeys.mutes() })
}

/** Takes someone off the muted list once the server has let them ask again. */
export function removeMute(userId: string): void {
  getQueryClient().setQueryData<RequestMute[]>(walletKeys.mutes(), (mutes) =>
    mutes?.filter((mute) => mute.user.id !== userId)
  )
}

export function removeRecipientFromCache(id: string): void {
  getQueryClient().setQueryData<WalletRecipient[]>(
    walletKeys.recipients(),
    (recipients) => recipients?.filter((recipient) => recipient.id !== id)
  )
}

/** Shows a request as settled in every loaded list the moment the server says so. */
export function markRequest(id: string, status: MoneyRequestStatus): void {
  const resolvedAt = new Date().toISOString()
  getQueryClient().setQueriesData<PaginatedPages<MoneyRequest>>(
    { queryKey: walletKeys.requestLists() },
    (data) =>
      mapItems(data, (request) =>
        request.id === id
          ? { ...request, status, resolved_at: resolvedAt }
          : request
      )
  )
  requestsChanged()
}

/** An account number opening, or opened, also moves the limits tier. */
export function virtualAccountChanged(account?: VirtualAccount | null): void {
  const queryClient = getQueryClient()
  if (account === undefined) {
    void queryClient.invalidateQueries({
      queryKey: walletKeys.virtualAccount(),
    })
  } else {
    queryClient.setQueryData(walletKeys.virtualAccount(), account)
  }
  void queryClient.invalidateQueries({ queryKey: walletKeys.limits() })
}
