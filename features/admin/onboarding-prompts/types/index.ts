export interface AdminPrompt {
  id: string
  emoji: string
  label: string
  placeholder: string
  position: number
  created_at: string
}

export interface CreatePromptInput {
  emoji: string
  label: string
  placeholder: string
  position: number
}

export interface UpdatePromptInput {
  emoji?: string
  label?: string
  placeholder?: string
  position?: number
}
