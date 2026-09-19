import type { FeedScope } from "./types"
import { DEFAULT_FEED_SCOPE } from "./utils/scopes"

let last: FeedScope = DEFAULT_FEED_SCOPE

export function rememberFeedScope(scope: FeedScope): void {
  last = scope
}

export function lastFeedScope(): FeedScope {
  return last
}
