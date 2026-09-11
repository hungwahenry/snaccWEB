import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { AvatarPicker } from "@/features/onboarding/components/avatar-picker"
import { AVATAR_EDITOR_PATH } from "@/features/avatar/routes"
import { UsernameField } from "@/features/onboarding/components/username-field"
import { PremiumNudge } from "@/features/premium/components/premium-nudge"
import type { UsernameStatus } from "@/features/onboarding/schemas"
import { GraduationYearSelect } from "@/features/users/components/graduation-year-select"
import { MONTH_SHORT } from "@/features/birthdays/utils/options"
import type { Birthday, Gender } from "@/features/users/types"
import { cn } from "@/lib/utils"
import { ProfilePhotos } from "./profile-photos"
import { EDIT_BIRTHDAY_PATH, EDIT_UNIVERSITY_PATH } from "../routes"

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
]

export type EditProfileFormProps = {
  canUploadPhoto: boolean
  canCustomizeAvatar: boolean
  displayNameMax: number
  usernameMax: number
  bioLimit: { value: number; show: boolean; label: string }
  campusName: string | null
  birthday: Birthday | null
  avatarUri: string
  pickAvatar: () => void
  coverUri: string | null
  pickCover: () => void
  removeCover: () => void
  displayName: string
  setDisplayName: (next: string) => void
  username: string
  changeUsername: (next: string) => void
  usernameStatus: UsernameStatus
  bio: string
  setBio: (next: string) => void
  major: string
  setMajor: (next: string) => void
  graduated: boolean
  toggleGraduated: (next: boolean) => void
  graduationYear: number | null
  setGraduationYear: (year: number) => void
  gender: Gender | ""
  setGender: (next: Gender | "") => void
  valid: boolean
  submitting: boolean
  onSubmit: () => void
}

function Field({
  label,
  action,
  children,
}: {
  label: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {action}
      </span>
      {children}
    </label>
  )
}

const INPUT = "h-14 rounded-full px-5 text-base md:text-base"

export function EditProfileForm(form: EditProfileFormProps) {
  return (
    <form
      className="flex flex-col gap-6 px-6 pt-4 pb-8"
      onSubmit={(event) => {
        event.preventDefault()
        form.onSubmit()
      }}
    >
      {form.canUploadPhoto ? (
        <ProfilePhotos
          coverUri={form.coverUri}
          avatarUri={form.avatarUri}
          onPickCover={form.pickCover}
          onRemoveCover={form.removeCover}
          onPickAvatar={form.pickAvatar}
        />
      ) : (
        <AvatarPicker
          uri={form.avatarUri}
          onPick={form.pickAvatar}
          editable={false}
        />
      )}

      {form.canCustomizeAvatar ? (
        <Button
          variant="outline"
          size="lg"
          className="-mt-2 w-full rounded-full"
          render={<Link href={AVATAR_EDITOR_PATH} />}
        >
          Customize avatar 🎨
        </Button>
      ) : null}

      <Field label="Display name">
        <Input
          value={form.displayName}
          onChange={(event) => form.setDisplayName(event.target.value)}
          placeholder="Ada Lovelace"
          maxLength={form.displayNameMax}
          className={INPUT}
        />
      </Field>

      <UsernameField
        value={form.username}
        status={form.usernameStatus}
        maxLength={form.usernameMax}
        onChange={form.changeUsername}
      />

      <Field
        label="Bio"
        action={
          <PremiumNudge show={form.bioLimit.show} label={form.bioLimit.label} />
        }
      >
        <Textarea
          value={form.bio}
          onChange={(event) => form.setBio(event.target.value)}
          placeholder="Tell people about yourself."
          maxLength={form.bioLimit.value}
          className="min-h-24 rounded-2xl px-5 py-4 text-base md:text-base"
        />
      </Field>

      <Field label="Major">
        <Input
          value={form.major}
          onChange={(event) => form.setMajor(event.target.value)}
          placeholder="Computer Science"
          maxLength={100}
          className={INPUT}
        />
      </Field>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              I&apos;ve already graduated 🎓
            </p>
            <p className="text-sm leading-5 text-muted-foreground">
              Alumni are welcome. Add the year you finished.
            </p>
          </div>
          <Switch
            checked={form.graduated}
            onCheckedChange={form.toggleGraduated}
          />
        </div>
        {form.graduated ? (
          <GraduationYearSelect
            value={form.graduationYear}
            onChange={form.setGraduationYear}
          />
        ) : null}
      </div>

      <Field label="Gender">
        <select
          value={form.gender}
          onChange={(event) =>
            form.setGender(event.target.value as Gender | "")
          }
          className="h-14 w-full appearance-none rounded-full bg-input px-5 text-base text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <option value="">Select</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-foreground">Campus</span>
        <Link
          href={EDIT_UNIVERSITY_PATH}
          className="flex h-14 items-center justify-between gap-2 rounded-full bg-input px-4 transition-opacity active:opacity-70"
        >
          <span
            className={cn(
              "flex-1 truncate text-base",
              form.campusName ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {form.campusName ?? "Pick your campus"}
          </span>
          <ChevronRightIcon className="size-5 text-muted-foreground" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-foreground">Birthday</span>
        <Link
          href={EDIT_BIRTHDAY_PATH}
          className="flex h-14 items-center justify-between gap-2 rounded-full bg-input px-4 transition-opacity active:opacity-70"
        >
          <span
            className={cn(
              "text-base",
              form.birthday ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {form.birthday
              ? `${form.birthday.day} ${MONTH_SHORT[form.birthday.month - 1]}`
              : "Add your birthday"}
          </span>
          <ChevronRightIcon className="size-5 text-muted-foreground" />
        </Link>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-14 text-base font-semibold"
        disabled={!form.valid || form.submitting}
      >
        {form.submitting ? <Spinner /> : "Save changes"}
      </Button>
    </form>
  )
}
