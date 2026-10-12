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
import { formatNaira, nairaToKobo } from "@/lib/format"
import type { Campaign, DraftProblems, PromotionStep } from "../types"
import {
  draftProblems,
  isReady,
  placementChoices,
  reachProblem,
  reviewRows,
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
import { useAdButtons, useCampaignPolicy } from "./use-campaigns"
import { useCampaignReach } from "./use-campaign-reach"
import { useCampaignSchedule } from "./use-campaign-schedule"
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
  const presetsKobo = useConfigValue("ads.budget_presets_kobo")
  const minAudience = useConfigValue("ads.min_audience")
  const now = useNow(TICK_MS)
  const [step, setStep] = useState<PromotionStep>("audience")

  function goTo(next: PromotionStep) {
    setStep(next)
    window.scrollTo({ top: 0 })
  }
  const homeCountry = useMe().data?.profile?.university?.country_code ?? ""
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
  })
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
      places: places.data ?? null,
      buttonLabel,
      start: schedule.fields.start,
      end: schedule.fields.end,
      estimate,
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
      options: (countries.data ?? [])
        .filter((country) => country.open)
        .map((country) => ({ value: country.code, label: country.name })),
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
        presetsKobo,
        reach.data?.price_per_thousand_kobo ?? null
      ),
      selectedKobo: budgetKobo,
      onPick: (kobo: number) => form.budget.onChange(String(kobo / 100)),
    },
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
