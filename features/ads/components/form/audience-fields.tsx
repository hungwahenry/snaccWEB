import { OptionSelect } from "@/components/ui/option-select"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { GRADUATION_YEARS } from "@/features/users/utils/graduation-years"
import type { NewPromotion } from "../../hooks/use-new-promotion"
import {
  JOINED_CHOICES,
  PLATFORM_CHOICES,
  STANDING_CHOICES,
  TARGET_GENDERS,
} from "../../utils/campaigns"
import { CampusPicker } from "./campus-picker"
import { ChoiceChips } from "./choice-chips"
import { FormField } from "./form-section"
import { HashtagField } from "./hashtag-field"
import { RegionPicker } from "./region-picker"

const YEAR_OPTIONS = [
  { value: "", label: "Any year" },
  ...GRADUATION_YEARS.map((year) => ({
    value: String(year),
    label: String(year),
  })),
]

const JOINED_OPTIONS = [
  { value: "", label: "Any time" },
  ...JOINED_CHOICES.map((choice) => ({
    value: String(choice.value),
    label: choice.label,
  })),
]

type AudienceFieldsProps = Pick<
  NewPromotion,
  | "country"
  | "campuses"
  | "regions"
  | "campusTypes"
  | "genders"
  | "graduation"
  | "standing"
  | "platforms"
  | "joined"
  | "hashtags"
>

export function AudienceFields({
  country,
  campuses,
  regions,
  campusTypes,
  genders,
  graduation,
  standing,
  platforms,
  joined,
  hashtags,
}: AudienceFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <FormField label="Country">
        <OptionSelect
          label="Runs in"
          value={country.value}
          options={country.options}
          onChange={country.onChange}
        />
      </FormField>

      <FormField label="Campuses">
        <CampusPicker {...campuses} />
      </FormField>

      {regions.groups.length > 0 ? (
        <FormField label="Regions">
          <RegionPicker {...regions} />
        </FormField>
      ) : null}

      {campusTypes.choices.length > 0 ? (
        <FormField label="Campus type">
          <ChoiceChips {...campusTypes} />
        </FormField>
      ) : null}

      <FormField label="Gender">
        <ChoiceChips choices={TARGET_GENDERS} {...genders} />
      </FormField>

      <FormField label="Students or graduates">
        <SegmentedControl
          label="Students or graduates"
          options={STANDING_CHOICES}
          {...standing}
        />
      </FormField>

      <FormField label="Graduation year">
        <div className="flex gap-3">
          <OptionSelect
            label="From"
            value={graduation.from}
            options={YEAR_OPTIONS}
            onChange={graduation.onFrom}
          />
          <OptionSelect
            label="To"
            value={graduation.to}
            options={YEAR_OPTIONS}
            onChange={graduation.onTo}
          />
        </div>
      </FormField>

      <FormField label="Uses Snacc on">
        <ChoiceChips choices={PLATFORM_CHOICES} {...platforms} />
      </FormField>

      <FormField label="Joined Snacc">
        <OptionSelect
          label="When"
          value={joined.value}
          options={JOINED_OPTIONS}
          onChange={joined.onChange}
        />
      </FormField>

      <FormField label="Into these hashtags">
        <HashtagField {...hashtags} />
      </FormField>
    </div>
  )
}
