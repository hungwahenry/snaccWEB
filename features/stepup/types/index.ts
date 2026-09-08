export type StepUpAction =
  "payout" | "email_change" | "account_delete" | "wallet_pin"

export interface StepUpRequest {
  action: StepUpAction
  newEmail?: string
}

export interface StepUpTargetView {
  label: string
  email: string
  verified: boolean
}

export interface StepUpChallenge {
  id: string
  action: StepUpAction
  verified: boolean
  targets: StepUpTargetView[]
  expires_at: string
}
