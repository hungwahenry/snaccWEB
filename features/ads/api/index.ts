import type { MoneyCredential } from "@/features/wallet/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdAudience,
  AdBudget,
  AdButtonOption,
  AdEvent,
  AdReach,
  Campaign,
  CampaignDetail,
  CreateCampaignInput,
  PolicyReason,
  PromotedSnacc,
} from "../types"
import type { Money } from "@/lib/money"

const hideUrl = (campaignId: string) =>
  `/ads/${encodeURIComponent(campaignId)}/hide`

const campaignUrl = (id: string) => `/ads/campaigns/${encodeURIComponent(id)}`

export async function recordAdEvents(events: AdEvent[]): Promise<void> {
  if (events.length === 0) return
  await api.post("/ads/events", { events })
}

export async function hidePromotion(campaignId: string): Promise<void> {
  await api.post(hideUrl(campaignId))
}

export async function unhidePromotion(campaignId: string): Promise<void> {
  await api.del(hideUrl(campaignId))
}

export const getDiscoverPromotion = () =>
  api.get<PromotedSnacc | null>("/ads/discover")

export const listCampaigns = (page: number) =>
  api.get<Paginated<Campaign>>("/ads/campaigns", { page })

export const getCampaignPolicy = () =>
  api.get<PolicyReason[]>("/ads/campaigns/policy")

export const getAdButtons = () =>
  api.get<AdButtonOption[]>("/ads/campaigns/buttons")

export const getAdBudget = () => api.get<AdBudget>("/ads/campaigns/budget")

export const estimateReach = (audience: AdAudience) =>
  api.post<AdReach>("/ads/campaigns/reach", audience)

export const getCampaign = (id: string) =>
  api.get<CampaignDetail>(campaignUrl(id))

export const createCampaign = (
  input: CreateCampaignInput,
  credential: MoneyCredential
) => api.post<Campaign>("/ads/campaigns", { ...input, ...credential })

export const cancelCampaign = (id: string) =>
  api.post<CampaignDetail>(`${campaignUrl(id)}/cancel`)

export const pauseCampaign = (id: string) =>
  api.post<CampaignDetail>(`${campaignUrl(id)}/pause`)

export const resumeCampaign = (id: string) =>
  api.post<CampaignDetail>(`${campaignUrl(id)}/resume`)

export const addCampaignBudget = (
  id: string,
  amount: Money,
  credential: MoneyCredential
) =>
  api.post<CampaignDetail>(`${campaignUrl(id)}/budget`, {
    amount,
    ...credential,
  })

export const extendCampaign = (id: string, endsAt: string) =>
  api.post<CampaignDetail>(`${campaignUrl(id)}/extend`, { endsAt })
