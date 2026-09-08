export interface OnboardingPrompt {
  emoji: string
  label: string
  placeholder: string
}

export const DEFAULT_PROMPTS: OnboardingPrompt[] = [
  {
    emoji: "🔥",
    label: "Hot take",
    placeholder: "Drop a hot take about {campus}…",
  },
  {
    emoji: "👀",
    label: "Campus gist",
    placeholder: "What's the gist on {campus} rn?",
  },
  {
    emoji: "🎓",
    label: "Fresher advice",
    placeholder: "One thing every {campus} fresher should know…",
  },
  { emoji: "💬", label: "Anything", placeholder: "What's on your mind?" },
]
