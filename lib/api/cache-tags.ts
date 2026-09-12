/** Whatever is cached about one person: their profile and their snaccs. */
export const userTag = (username: string) => `user:${username.toLowerCase()}`

/** Every cached snacc page and list, dropped together when someone's snaccs stop being public. */
export const SNACCS_TAG = "snaccs"
