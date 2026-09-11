export interface SnaccInsight {
  snacc_id: string
  excerpt: string | null
  views: number
  opens: number
  open_rate: number
  dwell_seconds: number
  reactions: number
  comments: number
  resnaccs: number
  quotes: number
  bookmarks: number
  shares: number
  author_taps: number
  engagement_rate: number
}

/** One day of the window. Every day is present, including the quiet ones. */
export interface InsightsDay {
  day: string
  views: number
  opens: number
  followers: number
}

export interface InsightsHour {
  hour: number
  views: number
}

export interface InsightsSummary {
  snaccs: number
  views: number
  opens: number
  open_rate: number
  dwell_seconds: number
  engagements: number
  engagement_rate: number
  followers_gained: number
  profile_visits: number
  series: InsightsDay[]
  hours: InsightsHour[]
  top: SnaccInsight[]
  best: SnaccInsight | null
}
