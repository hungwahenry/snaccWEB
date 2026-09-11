export interface Hashtag {
  tag: string
  usage_count: number
}

export interface HashtagSuggestion extends Hashtag {
  campus_usage_count: number
}
