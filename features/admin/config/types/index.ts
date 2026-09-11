export interface AdminConfigSetting {
  key: string
  value: unknown
  default_value: unknown
  is_default: boolean
  is_public: boolean
  category: string
  description: string
  updated_at: string
}

export interface UpdateConfigInput {
  value?: unknown
  isPublic?: boolean
}

/** How a setting's value is edited: a switch, a number, a line of text, or JSON. */
export type ConfigValueKind = "boolean" | "number" | "text" | "json"

export interface ConfigDraft {
  text: string
  on: boolean
  isPublic: boolean
}

export type ConfigValueParse =
  { ok: true; value: unknown } | { ok: false; message: string }

export interface ConfigGroup {
  category: string
  settings: AdminConfigSetting[]
}
