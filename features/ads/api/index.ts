import type { MoneyCredential } from "@/features/wallet/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdAudience,
  AdButtonOption,
  AdEvent,
  AdReach,
  Campaign,
  CampaignDetail,
  CreateCampaignInput,
  PolicyReason,
  PromotedSnacc,
} from "../types"

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
