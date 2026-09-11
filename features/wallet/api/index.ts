import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  ActivateVirtualAccountInput,
  Bank,
  BankAccountRef,
  CreateRequestInput,
  DeclineRequestInput,
  DepositAccount,
  DepositCheck,
  HistoryFilter,
  MoneyRequest,
  PayRequestInput,
  RequestBox,
  RequestMute,
  ResolvedBankAccount,
  SendToBankInput,
  SendToUserInput,
  SetPinInput,
  VirtualAccount,
  WalletLimits,
  WalletMonthSummary,
  WalletOverview,
  WalletRecipient,
  WalletSettings,
  WalletTransaction,
  WalletTransactionDetail,
} from "../types"

export const getWalletOverview = () => api.get<WalletOverview>("/wallet")

export const getLimits = () => api.get<WalletLimits>("/wallet/limits")

export const updateWalletSettings = (settings: WalletSettings) =>
  api.put<void>("/wallet/settings", settings)

export const listWalletTransactions = (
  page: number,
  filter: HistoryFilter = {}
) =>
  api.get<Paginated<WalletTransaction>>("/wallet/transactions", {
    page,
    ...filter,
  })

export const getTransactionDetail = (id: string) =>
  api.get<WalletTransactionDetail>(
    `/wallet/transactions/${encodeURIComponent(id)}`
  )

export const getSummary = (month: string) =>
  api.get<WalletMonthSummary>("/wallet/summary", { month })

export const getRecipients = () =>
  api.get<WalletRecipient[]>("/wallet/recipients")

export const removeRecipient = (id: string) =>
  api.del<void>(`/wallet/recipients/${encodeURIComponent(id)}`)

export const listRequests = (box: RequestBox, page: number) =>
  api.get<Paginated<MoneyRequest>>("/wallet/requests", { box, page })

export const createRequest = (input: CreateRequestInput) =>
  api.post<MoneyRequest>("/wallet/requests", input)

export const payRequest = ({ id, ...credential }: PayRequestInput) =>
  api.post<WalletOverview>(
    `/wallet/requests/${encodeURIComponent(id)}/pay`,
    credential
  )

export const declineRequest = ({ id, mute = false }: DeclineRequestInput) =>
  api.post<void>(`/wallet/requests/${encodeURIComponent(id)}/decline`, {
    mute,
  })

export const cancelRequest = (id: string) =>
  api.post<void>(`/wallet/requests/${encodeURIComponent(id)}/cancel`)

export const getMutes = () => api.get<RequestMute[]>("/wallet/mutes")

export const unmuteRequester = (userId: string) =>
  api.del<void>(`/wallet/mutes/${encodeURIComponent(userId)}`)

export const getBanks = () => api.get<Bank[]>("/wallet/banks")

export const resolveBankAccount = (account: BankAccountRef) =>
  api.get<ResolvedBankAccount>("/wallet/resolve-bank", { ...account })

export const sendToBank = (input: SendToBankInput) =>
  api.post<WalletOverview>("/wallet/send-bank", input)

export const sendToUser = (input: SendToUserInput) =>
  api.post<WalletOverview>("/wallet/send", input)

export const startDeposit = (amountKobo: number) =>
  api.post<DepositAccount>("/wallet/deposits", { amountKobo })

export const verifyDeposit = (reference: string) =>
  api.post<DepositCheck>(
    `/wallet/deposits/${encodeURIComponent(reference)}/verify`
  )

export const setPin = (input: SetPinInput) =>
  api.post<void>("/wallet/pin", input)

export async function getVirtualAccount(): Promise<VirtualAccount | null> {
  const result = await api.get<{ account: VirtualAccount | null }>(
    "/wallet/virtual-account"
  )
  return result.account
}

export async function activateVirtualAccount(
  input: ActivateVirtualAccountInput
): Promise<VirtualAccount | null> {
  const result = await api.post<{ account: VirtualAccount | null }>(
    "/wallet/virtual-account",
    input
  )
  return result.account
}
