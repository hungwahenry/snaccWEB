"use client"

import { useQuery } from "@tanstack/react-query"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import {
  getCampusFund,
  getEarningsBalance,
  getTopSnaccs,
  listEarningEvents,
} from "../api"
import { earningsKeys } from "../utils/keys"

export function useEarningsBalance() {
  return useQuery({
    queryKey: earningsKeys.balance(),
    queryFn: getEarningsBalance,
  })
}

export function useCampusFund() {
  return useQuery({ queryKey: earningsKeys.fund(), queryFn: getCampusFund })
}

export function useTopSnaccs() {
  return useQuery({ queryKey: earningsKeys.topSnaccs(), queryFn: getTopSnaccs })
}

export function useEarningEvents() {
  return useInfiniteList(earningsKeys.events(), listEarningEvents)
}
