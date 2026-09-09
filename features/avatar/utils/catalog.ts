import data from "./adventurer.json"

export type AvatarOptions = Record<string, string | number>

export interface Choice {
  id: string
  apply: AvatarOptions
  clear?: string[]
  swatch?: string
}

export interface Category {
  key: string
  label: string
  kind: "avatar" | "color"
  choices: Choice[]
}

const variants = (key: string, values: string[]): Choice[] =>
  values.map((v) => ({ id: v, apply: { [key]: v } }))

const colors = (key: string, values: string[]): Choice[] =>
  values.map((hex) => ({ id: hex, apply: { [key]: hex }, swatch: `#${hex}` }))

const none = (apply: AvatarOptions, clear?: string[]): Choice => ({
  id: "none",
  apply,
  clear,
})

// A "none" option plus variants, each toggling its DiceBear probability on when picked.
const optional = (key: string, values: string[], probKey: string): Choice[] => [
  none({ [probKey]: 0 }),
  ...values.map((v) => ({ id: v, apply: { [key]: v, [probKey]: 100 } })),
]

export const CATEGORIES: Category[] = [
  {
    key: "background",
    label: "Background",
    kind: "color",
    choices: [
      none({}, ["backgroundColor", "backgroundType"]),
      ...data.backgroundColor.map((hex) => ({
        id: hex,
        apply: { backgroundColor: hex, backgroundType: "solid" },
        swatch: `#${hex}`,
      })),
    ],
  },
  {
    key: "skinColor",
    label: "Skin",
    kind: "color",
    choices: colors("skinColor", data.skinColor),
  },
  {
    key: "hair",
    label: "Hair",
    kind: "avatar",
    choices: [
      none({ hairProbability: 0 }),
      ...data.hair.map((v) => ({
        id: v,
        apply: { hair: v, hairProbability: 100 },
      })),
    ],
  },
  {
    key: "hairColor",
    label: "Hair color",
    kind: "color",
    choices: colors("hairColor", data.hairColor),
  },
  {
    key: "eyes",
    label: "Eyes",
    kind: "avatar",
    choices: variants("eyes", data.eyes),
  },
  {
    key: "eyebrows",
    label: "Brows",
    kind: "avatar",
    choices: variants("eyebrows", data.eyebrows),
  },
  {
    key: "mouth",
    label: "Mouth",
    kind: "avatar",
    choices: variants("mouth", data.mouth),
  },
  {
    key: "glasses",
    label: "Glasses",
    kind: "avatar",
    choices: optional("glasses", data.glasses, "glassesProbability"),
  },
  {
    key: "features",
    label: "Features",
    kind: "avatar",
    choices: optional("features", data.features, "featuresProbability"),
  },
  {
    key: "earrings",
    label: "Earrings",
    kind: "avatar",
    choices: optional("earrings", data.earrings, "earringsProbability"),
  },
]

export function applyChoice(
  options: AvatarOptions,
  choice: Choice
): AvatarOptions {
  const next = { ...options, ...choice.apply }
  for (const key of choice.clear ?? []) delete next[key]
  return next
}

export function isActive(options: AvatarOptions, choice: Choice): boolean {
  for (const [key, value] of Object.entries(choice.apply)) {
    if (options[key] !== value) return false
  }
  for (const key of choice.clear ?? []) {
    if (options[key] !== undefined) return false
  }
  return true
}
