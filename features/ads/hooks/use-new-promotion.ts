"use client"

import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import {
  useCountries,
  useCountryPlaces,
} from "@/features/places/hooks/use-places"
import { regionGroups } from "@/features/places/utils/regions"
import { useCampusSheet } from "@/features/universities/hooks/use-campus-sheet"
import type { Snacc } from "@/features/snaccs/types"
import { toEmbedded } from "@/features/snaccs/utils/resnaccs"
import { useWalletOverview } from "@/features/wallet/hooks/account/use-wallet-overview"
import { useNow } from "@/hooks/use-now"
import {
  currencySymbol,
  formatMoney,
  inputToMoney,
  money,
  type Money,
} from "@/lib/money"
import type { Campaign, DraftProblems, PromotionStep } from "../types"
import {
  draftProblems,
  isReady,
  placementChoices,
  promotableCountries,
  reachProblem,
  reviewRows,
  wholeUnitsOf,
} from "../utils/draft"
import { budgetPresets, estimateOf } from "../utils/estimate"
import { promotedPreview } from "../utils/preview"
import {
  firstProblem,
  nextStep,
  previousStep,
  stepLabel,
  stepOf,
  stepReady,
} from "../utils/steps"
import { useCampaignDraft } from "./use-campaign-draft"
import { useAdBudget, useAdButtons, useCampaignPolicy } from "./use-campaigns"
import { useCampaignReach } from "./use-campaign-reach"
import { useCampaignSchedule } from "./use-campaign-schedule"
import { useCreateCampaign } from "./use-create-campaign"

const TICK_MS = 30_000

export function useNewPromotion(
  snacc: Snacc,
  source: Campaign | null,
  currency: string,
  onLeave: () => void
) {
  const maxDays = useConfigValue("ads.max_days")
  const maxLeadDays = useConfigValue("ads.max_lead_days")
  const minAudience = useConfigValue("ads.min_audience")
  const now = useNow(TICK_MS)
  const [step, setStep] = useState<PromotionStep>("audience")

  function goTo(next: PromotionStep) {
    setStep(next)
    window.scrollTo({ top: 0 })
  }
  const profile = useMe().data?.profile
  const homeCountry =
    profile?.country_code ?? profile?.university?.country_code ?? ""
  const form = useCampaignDraft(
    snacc.clip !== null,
    maxDays,
    source,
    homeCountry
  )
  const { draft } = form
  const countries = useCountries()
  const places = useCountryPlaces(draft.countryCode || null)
  const campusSheet = useCampusSheet(form.campuses.onAdd, {
    country: draft.countryCode || null,
    exclude: draft.campuses.map((campus) => campus.id),
    verifiedOnly: true,
  })
  const reach = useCampaignReach(form.audience)
  const policy = useCampaignPolicy()
  const buttons = useAdButtons()
  const adBudget = useAdBudget()
  const wallet = useWalletOverview()
  const schedule = useCampaignSchedule(
    draft,
    { maxDays, maxLeadDays },
    form.setSchedule
  )
  const create = useCreateCampaign(snacc.id, (field) => goTo(stepOf(field)))

  const balance = wallet.data?.balance ?? null
  const minBudget = adBudget.data?.minimum ?? money(0, currency)
  const budget = inputToMoney(draft.budget, currency)
  const refusal = create.refusal?.draft === draft ? create.refusal : null

  const problems: DraftProblems = draftProblems(draft, {
    now,
    minBudget,
    maxDays,
    maxLeadDays,
    balance,
  })
  const tooNarrow = reachProblem(reach.error, reach.data?.people, minAudience)
  if (tooNarrow && !problems.audience) problems.audience = tooNarrow
  if (refusal) problems[refusal.field] = refusal.message

  const estimate = reach.data ? estimateOf(reach.data, budget) : null
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
      ready: stepReady(step, problems, budget),
      onNext: () => {
        if (following && stepReady(step, problems, budget)) goTo(following)
      },
    },
    review: reviewRows({
      draft,
      places: places.data ?? null,
      buttonLabel,
      start: schedule.fields.start,
      end: schedule.fields.end,
      estimate,
      budget,
    }),
    preview: toEmbedded(snacc),
    card: promotedPreview(
      snacc,
      buttonLabel && draft.buttonUrl.trim()
        ? { label: buttonLabel, url: draft.buttonUrl.trim() }
        : null
    ),
    problems,
    country: {
      ...form.country,
      options: promotableCountries(countries.data ?? [], currency),
    },
    campuses: {
      picked: form.campuses.picked,
      onRemove: form.campuses.onRemove,
      onOpen: campusSheet.show,
      sheet: campusSheet.sheet,
    },
    regions: {
      ...form.regions,
      groups: regionGroups(places.data?.regions ?? []),
    },
    campusTypes: {
      ...form.campusTypes,
      choices: (places.data?.campus_types ?? []).map((type) => ({
        value: type.id,
        label: type.name,
      })),
    },
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
    presets: {
      presets: budgetPresets(
        adBudget.data?.presets ?? [],
        reach.data?.price_per_thousand ?? null
      ),
      selected: budget,
      onPick: (amount: Money) => form.budget.onChange(wholeUnitsOf(amount)),
    },
    budget: {
      ...form.budget,
      symbol: currencySymbol(currency),
      hint: adBudget.data ? `At least ${formatMoney(minBudget)}` : "",
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
      label: budget.amount > 0 ? `Pay ${formatMoney(budget)}` : "Pay and send",
      balance:
        balance === null
          ? null
          : `From your Snacc balance of ${formatMoney(balance)}.`,
      ready: isReady(draft, problems) && adBudget.data !== undefined,
      problem: firstProblem(problems),
      paying: create.paying,
      onPay: () => void create.pay(draft, currency),
    },
  }
}

export type NewPromotion = ReturnType<typeof useNewPromotion>
