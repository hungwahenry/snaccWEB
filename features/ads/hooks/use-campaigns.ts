"use client"

import { useQuery } from "@tanstack/react-query"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import {
  getAdButtons,
  getCampaign,
  getCampaignPolicy,
  listCampaigns,
} from "../api"
import { adKeys } from "../utils/keys"

export function useCampaigns(enabled: boolean) {
  return useInfiniteList(adKeys.campaigns(), listCampaigns, { enabled })
}

export function useCampaign(id: string, enabled: boolean) {
  return useQuery({
    queryKey: adKeys.campaign(id),
    queryFn: () => getCampaign(id),
    enabled,
  })
}

export function useCampaignPolicy() {
  return useQuery({
    queryKey: adKeys.policy(),
    queryFn: getCampaignPolicy,
  })
}

export function useAdButtons() {
  return useQuery({
    queryKey: adKeys.buttons(),
    queryFn: getAdButtons,
  })
}
