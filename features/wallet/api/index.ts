import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  Bank,
  DepositAccount,
  DepositCheck,
  HistoryKind,
  MoneyRequest,
  RequestMute,
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

export const claimEarnings = () =>
  api.post<WalletOverview & { claimed: number }>("/wallet/claim")

export const getLimits = () => api.get<WalletLimits>("/wallet/limits")

export const updateWalletSettings = (settings: WalletSettings) =>
  api.put<void>("/wallet/settings", settings)

export interface HistoryFilter {
  kind?: HistoryKind
  month?: string
}

export const listWalletTransactions = (
  page: number,
  filter: HistoryFilter = {}
) =>
  api.get<Paginated<WalletTransaction>>("/wallet/transactions", {
    page,
    ...filter,
  })

export const getTransactionDetail = (id: string) =>
  api.get<WalletTransactionDetail>(`/wallet/transactions/${id}`)

export const getSummary = (month: string) =>
  api.get<WalletMonthSummary>("/wallet/summary", { month })

export const listRecipients = () =>
  api.get<WalletRecipient[]>("/wallet/recipients")

export const removeRecipient = (id: string) =>
  api.del<void>(`/wallet/recipients/${id}`)

export const listRequests = (box: "incoming" | "outgoing", page: number) =>
  api.get<Paginated<MoneyRequest>>("/wallet/requests", { box, page })

export const createRequest = (input: {
  username: string
  amountKobo: number
  note?: string
  conversationId?: string
}) => api.post<MoneyRequest>("/wallet/requests", input)

export const payRequest = (input: {
  id: string
  pin?: string
  stepUpId?: string
}) =>
  api.post<WalletOverview>(`/wallet/requests/${input.id}/pay`, {
    pin: input.pin,
    stepUpId: input.stepUpId,
  })

export const declineRequest = (input: { id: string; mute?: boolean }) =>
  api.post<void>(`/wallet/requests/${input.id}/decline`, {
    mute: input.mute ?? false,
  })

export const cancelRequest = (id: string) =>
  api.post<void>(`/wallet/requests/${id}/cancel`)

export const listMutes = () => api.get<RequestMute[]>("/wallet/mutes")

export const unmute = (userId: string) =>
  api.del<void>(`/wallet/mutes/${userId}`)

export const getBanks = () => api.get<Bank[]>("/wallet/banks")

export const resolveBankAccount = (input: {
  bankCode: string
  accountNumber: string
}) => api.get<{ account_name: string }>("/wallet/resolve-bank", input)

export type BankSendInput = {
  amountKobo: number
  pin?: string
  stepUpId?: string
} & ({ recipientId: string } | { bankCode: string; accountNumber: string })

export const sendToBank = (input: BankSendInput) =>
  api.post<WalletOverview>("/wallet/send-bank", input)

export const sendToUser = (input: {
  username: string
  amountKobo: number
  pin?: string
  stepUpId?: string
  conversationId?: string
  note?: string
}) => api.post<WalletOverview>("/wallet/send", input)

export const startDeposit = (amountKobo: number) =>
  api.post<DepositAccount>("/wallet/deposits", { amountKobo })

export const verifyDeposit = (reference: string) =>
  api.post<DepositCheck>(`/wallet/deposits/${reference}/verify`)

export const setPin = (input: { pin: string; stepUpId: string }) =>
  api.post<void>("/wallet/pin", input)

export const verifyPin = (pin: string) =>
  api.post<void>("/wallet/pin/verify", { pin })

export async function getVirtualAccount(): Promise<VirtualAccount | null> {
  const result = await api.get<{ account: VirtualAccount | null }>(
    "/wallet/virtual-account"
  )
  return result.account
}

export async function activateVirtualAccount(input: {
  firstName: string
  lastName: string
  phone: string
  bvn?: string
  accountNumber?: string
  bankCode?: string
}): Promise<VirtualAccount | null> {
  const result = await api.post<{ account: VirtualAccount | null }>(
    "/wallet/virtual-account",
    input
  )
  return result.account
}
