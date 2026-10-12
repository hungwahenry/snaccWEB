"use client"

import { useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import type { Snacc } from "@/features/snaccs/types"
import { toEmbedded } from "@/features/snaccs/utils/resnaccs"
import { useWalletOverview } from "@/features/wallet/hooks/account/use-wallet-overview"
import { useNow } from "@/hooks/use-now"
import { formatNaira, nairaToKobo } from "@/lib/format"
import type {
  Campaign,
  CampusPick,
  DraftProblems,
  PromotionStep,
} from "../types"
import {
  draftProblems,
  isReady,
  placementChoices,
  reachProblem,
  reviewRows,
} from "../utils/draft"
import { estimateOf } from "../utils/estimate"
import {
  firstProblem,
  nextStep,
  previousStep,
  stepLabel,
  stepOf,
  stepReady,
} from "../utils/steps"
import { useCampaignDraft } from "./use-campaign-draft"
import { useAdButtons, useCampaignPolicy } from "./use-campaigns"
import { useCampaignReach } from "./use-campaign-reach"
import { useCampaignSchedule } from "./use-campaign-schedule"
import { useCampusSearch } from "./use-campus-search"
import { useCreateCampaign } from "./use-create-campaign"

const TICK_MS = 30_000

export function useNewPromotion(
  snacc: Snacc,
  source: Campaign | null,
  onLeave: () => void
) {
  const maxDays = useConfigValue("ads.max_days")
  const maxLeadDays = useConfigValue("ads.max_lead_days")
  const minBudgetKobo = useConfigValue("ads.min_budget_kobo")
  const minAudience = useConfigValue("ads.min_audience")
  const now = useNow(TICK_MS)
  const [step, setStep] = useState<PromotionStep>("audience")

  function goTo(next: PromotionStep) {
    setStep(next)
    window.scrollTo({ top: 0 })
  }
  const form = useCampaignDraft(snacc.clip !== null, maxDays, source)
  const { draft } = form
  const search = useCampusSearch(draft.campuses)
  const reach = useCampaignReach(form.audience)
  const policy = useCampaignPolicy()
  const buttons = useAdButtons()
  const wallet = useWalletOverview()
  const schedule = useCampaignSchedule(
    draft,
    { maxDays, maxLeadDays },
    form.setSchedule
  )
  const create = useCreateCampaign(snacc.id, (field) => goTo(stepOf(field)))

  const balanceKobo = wallet.data?.balance ?? null
  const budgetKobo = nairaToKobo(draft.budget)
  const refusal = create.refusal?.draft === draft ? create.refusal : null

  const problems: DraftProblems = draftProblems(draft, {
    now,
    minBudgetKobo,
    maxDays,
    maxLeadDays,
    balanceKobo,
  })
  const tooNarrow = reachProblem(reach.error, reach.data?.people, minAudience)
  if (tooNarrow && !problems.audience) problems.audience = tooNarrow
  if (refusal) problems[refusal.field] = refusal.message

  const estimate = reach.data ? estimateOf(reach.data, budgetKobo) : null
  const buttonLabel =
    buttons.data?.find((button) => button.id === draft.buttonId)?.label ?? null
  const following = nextStep(step)

  return {
    step,
    header: {
      title: "Promote",
      subtitle: stepLabel(step),
      onBack: () => {
        const previous = previousStep(step)
        if (previous) goTo(previous)
        else onLeave()
      },
    },
    next: {
      label: following === "review" ? "Review" : "Continue",
      ready: stepReady(step, problems, budgetKobo),
      onNext: () => {
        if (following && stepReady(step, problems, budgetKobo)) goTo(following)
      },
    },
    review: reviewRows({
      draft,
      buttonLabel,
      start: schedule.fields.start,
      end: schedule.fields.end,
      estimate,
    }),
    preview: toEmbedded(snacc),
    problems,
    campuses: {
      ...form.campuses,
      search: search.search,
      onSearch: search.onSearch,
      searching: search.searching,
      results: search.results,
      onAdd: (campus: CampusPick) => {
        form.campuses.onAdd(campus)
        search.clear()
      },
    },
    regions: form.regions,
    ownerships: form.ownerships,
    genders: form.genders,
    graduation: form.graduation,
    standing: form.standing,
    platforms: form.platforms,
    joined: form.joined,
    hashtags: form.hashtags,
    placements: {
      choices: placementChoices(snacc.clip !== null),
      ...form.placements,
    },
    button: {
      ...form.button,
      options: [
        { value: "", label: "No button" },
        ...(buttons.data ?? []).map((button) => ({
          value: button.id,
          label: button.label,
        })),
      ],
    },
    schedule: schedule.fields,
    timeSheet: schedule.sheet,
    budget: {
      ...form.budget,
      hint: `At least ${formatNaira(minBudgetKobo)}`,
    },
    reach: {
      estimate,
      loading: reach.isPending,
    },
    policy: {
      reasons: policy.data ?? [],
      loading: policy.isPending,
      failed: policy.isError,
      onRetry: () => void policy.refetch(),
    },
    pay: {
      label: budgetKobo > 0 ? `Pay ${formatNaira(budgetKobo)}` : "Pay and send",
      balance:
        balanceKobo === null
          ? null
          : `From your Snacc balance of ${formatNaira(balanceKobo)}.`,
      ready: isReady(draft, problems),
      problem: firstProblem(problems),
      paying: create.paying,
      onPay: () => void create.pay(draft),
    },
  }
}

export type NewPromotion = ReturnType<typeof useNewPromotion>
