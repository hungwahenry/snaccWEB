/** Pages that belong to the site rather than to any feature. */
export const LANDING_PATH = "/"
export const DOWNLOAD_PATH = "/download"
export const TERMS_PATH = "/terms"
export const PRIVACY_PATH = "/privacy"
export const GUIDELINES_PATH = "/community-guidelines"
export const ADMIN_PATH = "/admin"

export const sitePagePath = (slug: string) => `/${encodeURIComponent(slug)}`
