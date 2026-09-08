"use client"

import { useQuery } from "@tanstack/react-query"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import {
  getCampusFund,
  getEarningsWallet,
  getTopSnaccs,
  listEarningEvents,
} from "../api"

export const EARNINGS_WALLET_KEY = ["earnings", "wallet"]
export const CAMPUS_FUND_KEY = ["earnings", "fund"]

export function useEarningsWallet() {
  return useQuery({ queryKey: EARNINGS_WALLET_KEY, queryFn: getEarningsWallet })
}

export function useCampusFund() {
  return useQuery({ queryKey: CAMPUS_FUND_KEY, queryFn: getCampusFund })
}

export function useTopSnaccs() {
  return useQuery({
    queryKey: ["earnings", "top-snaccs"],
    queryFn: getTopSnaccs,
  })
}

export function useEarningEvents() {
  return useInfiniteList(["earnings", "events"], listEarningEvents)
}
