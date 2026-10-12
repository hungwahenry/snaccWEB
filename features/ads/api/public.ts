import { serverGet } from "@/lib/api/server"
import type { AdsInfo } from "../types"

export const getAdsInfo = () => serverGet<AdsInfo>("/ads/info")
