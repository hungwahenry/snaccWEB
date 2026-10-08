import type { AdminChatTheme, UpdateChatThemeInput } from "../types"

export function chatThemeMessage(
  theme: Pick<AdminChatTheme, "label" | "enabled" | "premium">,
  input: UpdateChatThemeInput
): string {
  if (input.premium !== undefined) {
    return theme.premium
      ? `${theme.label} now needs Premium.`
      : `${theme.label} is free for everyone.`
  }
  return theme.enabled
    ? `${theme.label} is offered in the picker.`
    : `${theme.label} is no longer offered.`
}
