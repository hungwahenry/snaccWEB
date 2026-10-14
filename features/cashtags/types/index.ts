export interface CoinPrice {
  currency: string
  price: number
}

export interface Cashtag {
  id: string
  symbol: string
  name: string
  image_url: string | null
  rank: number | null
  price_usd: number | null
  prices: CoinPrice[]
  change_24h_pct: number | null
  change_7d_pct: number | null
  market_cap_usd: number | null
  high_24h_usd: number | null
  low_24h_usd: number | null
  sparkline: number[]
  quoted_at: string | null
}
