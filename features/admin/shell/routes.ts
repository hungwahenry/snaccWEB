export const ADMIN_PATH = "/admin"
export const ADMIN_PROFILE_PATH = "/admin/profile"

export const REPORTS_PATH = "/admin/reports"
export const SNACCS_PATH = "/admin/snaccs"
export const MOMENTS_PATH = "/admin/moments"
export const MESSAGES_PATH = "/admin/messages"
export const MODERATION_PATH = "/admin/moderation"
export const REPORT_REASONS_PATH = "/admin/report-reasons"
export const SUSPENSION_REASONS_PATH = "/admin/suspension-reasons"

export const USERS_PATH = "/admin/users"
export const SUSPENSIONS_PATH = "/admin/suspensions"
export const ADMINS_PATH = "/admin/admins"
export const ROLES_PATH = "/admin/roles"
export const RESERVED_USERNAMES_PATH = "/admin/reserved-usernames"

export const WALLETS_PATH = "/admin/wallet"
export const WITHDRAWALS_PATH = "/admin/withdrawals"
export const EARNINGS_PATH = "/admin/earnings"

export const CONFIG_PATH = "/admin/config"
export const FLAGS_PATH = "/admin/flags"
export const ENGAGEMENT_PATH = "/admin/engagement"
export const SCORE_TIERS_PATH = "/admin/score-tiers"
export const EGGS_PATH = "/admin/eggs"
export const UNIVERSITIES_PATH = "/admin/universities"
export const NOTIFICATION_TYPES_PATH = "/admin/notification-types"
export const PROMPTS_PATH = "/admin/prompts"
export const GHOST_HOUR_PATH = "/admin/ghost-hour"

export const PAGES_PATH = "/admin/pages"
export const NEW_PAGE_PATH = "/admin/pages/new"
export const ANNOUNCEMENTS_PATH = "/admin/announcements"

export const OPS_PATH = "/admin/ops"
export const AUDIT_PATH = "/admin/audit"

export const reportPath = (id: string) => `${REPORTS_PATH}/${id}`
export const snaccPath = (id: string) => `${SNACCS_PATH}/${id}`
export const threadPath = (id: string) => `${MESSAGES_PATH}/${id}`
export const userPath = (id: string) => `${USERS_PATH}/${id}`
export const walletPath = (userId: string) => `${WALLETS_PATH}/${userId}`
export const withdrawalPath = (id: string) => `${WITHDRAWALS_PATH}/${id}`
export const pagePath = (id: string) => `${PAGES_PATH}/${id}`
