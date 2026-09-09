export interface SnaccInsight {
  snaccId: string
  excerpt: string | null
  views: number
  opens: number
  openRate: number
  dwellSeconds: number
  reactions: number
  comments: number
  resnaccs: number
  quotes: number
  bookmarks: number
  shares: number
  authorTaps: number
  engagementRate: number
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
  openRate: number
  dwellSeconds: number
  engagements: number
  engagementRate: number
  followersGained: number
  profileVisits: number
  series: InsightsDay[]
  hours: InsightsHour[]
  top: SnaccInsight[]
  best: SnaccInsight | null
}
