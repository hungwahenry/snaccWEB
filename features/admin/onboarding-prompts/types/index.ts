export interface AdminPrompt {
  id: string
  emoji: string
  label: string
  placeholder: string
  position: number
  created_at: string
}

export interface PromptInput {
  emoji: string
  label: string
  placeholder: string
  position: number
}

export interface PromptDraft {
  emoji: string
  label: string
  placeholder: string
  position: string
}
