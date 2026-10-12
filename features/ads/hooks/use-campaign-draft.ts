"use client"

import { useMemo, useState } from "react"
import type { Gender } from "@/features/users/types"
import type {
  AdPlacement,
  AdPlatform,
  CampaignDraft,
  CampusPick,
  NigerianState,
  Ownership,
  RegionStates,
  Standing,
} from "../types"
import {
  addHashtag,
  audienceOf,
  HASHTAGS_MAX,
  newDraft,
  toggleIn,
  wholeNaira,
} from "../utils/draft"
import { toggleRegion } from "../utils/regions"

const yearOf = (value: string) => (value ? Number(value) : null)

export function useCampaignDraft(clip: boolean, maxDays: number) {
  const [draft, setDraft] = useState(() => newDraft(Date.now(), clip, maxDays))
  const [tagText, setTagText] = useState("")
  const audience = useMemo(() => audienceOf(draft), [draft])

  const set = (patch: Partial<CampaignDraft>) =>
    setDraft((current) => ({ ...current, ...patch }))

  const update = (change: (current: CampaignDraft) => Partial<CampaignDraft>) =>
    setDraft((current) => ({ ...current, ...change(current) }))

  function addTag() {
    update((current) => ({ hashtags: addHashtag(current.hashtags, tagText) }))
    setTagText("")
  }

  return {
    draft,
    audience,
    setSchedule: (patch: Pick<Partial<CampaignDraft>, "startsAt" | "endsAt">) =>
      set(patch),
    campuses: {
      picked: draft.campuses,
      onAdd: (campus: CampusPick) =>
        update((current) => ({
          campuses: current.campuses.some((item) => item.id === campus.id)
            ? current.campuses
            : [
                ...current.campuses,
                { id: campus.id, name: campus.name, acronym: campus.acronym },
              ],
        })),
      onRemove: (id: string) =>
        update((current) => ({
          campuses: current.campuses.filter((campus) => campus.id !== id),
        })),
    },
    regions: {
      picked: draft.states,
      onToggleRegion: (region: RegionStates) =>
        update((current) => ({ states: toggleRegion(current.states, region) })),
      onToggleState: (state: NigerianState) =>
        update((current) => ({ states: toggleIn(current.states, state) })),
    },
    ownerships: {
      value: draft.ownerships,
      onToggle: (value: Ownership) =>
        update((current) => ({
          ownerships: toggleIn(current.ownerships, value),
        })),
    },
    genders: {
      value: draft.genders,
      onToggle: (value: Gender) =>
        update((current) => ({ genders: toggleIn(current.genders, value) })),
    },
    graduation: {
      from: draft.graduationFrom === null ? "" : String(draft.graduationFrom),
      to: draft.graduationTo === null ? "" : String(draft.graduationTo),
      onFrom: (value: string) => set({ graduationFrom: yearOf(value) }),
      onTo: (value: string) => set({ graduationTo: yearOf(value) }),
    },
    standing: {
      value: draft.standing,
      onChange: (value: Standing) => set({ standing: value }),
    },
    platforms: {
      value: draft.platforms,
      onToggle: (value: AdPlatform) =>
        update((current) => ({
          platforms: toggleIn(current.platforms, value),
        })),
    },
    joined: {
      value:
        draft.joinedWithinDays === null ? "" : String(draft.joinedWithinDays),
      onChange: (value: string) =>
        set({ joinedWithinDays: value ? Number(value) : null }),
    },
    hashtags: {
      tags: draft.hashtags,
      text: tagText,
      full: draft.hashtags.length >= HASHTAGS_MAX,
      onText: setTagText,
      onAdd: addTag,
      onRemove: (tag: string) =>
        update((current) => ({
          hashtags: current.hashtags.filter((item) => item !== tag),
        })),
    },
    placements: {
      value: draft.placements,
      onToggle: (value: AdPlacement) =>
        update((current) => ({
          placements: toggleIn(current.placements, value),
        })),
    },
    button: {
      value: draft.buttonId ?? "",
      link: draft.buttonUrl,
      onPick: (value: string) =>
        set(value ? { buttonId: value } : { buttonId: null, buttonUrl: "" }),
      onLink: (value: string) => set({ buttonUrl: value }),
    },
    budget: {
      value: draft.budget,
      onChange: (value: string) => set({ budget: wholeNaira(value) }),
    },
  }
}
