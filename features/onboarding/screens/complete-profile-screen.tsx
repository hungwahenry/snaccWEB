"use client"

import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import { OnboardingFooter } from "../components/onboarding-footer"
import { OnboardingHeader } from "../components/onboarding-header"
import { ProfileStep } from "../components/profile-step"
import { UniversityStep } from "../components/university-step"
import { useOnboardingForm } from "../hooks/use-onboarding-form"

export function CompleteProfileScreen() {
  const form = useOnboardingForm()
  const displayNameMax = useConfigValue("profile.display_name.max_length")
  const usernameMax = useConfigValue("profile.username.max_length")
  const canUploadPhoto = useFlag("profile_photo_upload")

  const showFooter = !(form.step === 1 && !form.university)

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 pt-4 pb-8">
        <OnboardingHeader
          step={form.step}
          totalSteps={form.totalSteps}
          onBack={form.back}
          onLogout={form.logout}
          loggingOut={form.loggingOut}
        />

        <div className="flex-1">
          {form.step === 0 ? (
            <ProfileStep
              avatarUri={form.avatarUri}
              canUploadPhoto={canUploadPhoto}
              onPickAvatar={form.pickAvatar}
              displayName={form.displayName}
              displayNameMax={displayNameMax}
              onChangeDisplayName={form.setDisplayName}
              username={form.username}
              usernameMax={usernameMax}
              onChangeUsername={form.changeUsername}
              usernameStatus={form.usernameStatus}
            />
          ) : (
            <UniversityStep
              search={form.search}
              onSearch={form.setSearch}
              results={form.universities}
              loading={form.universitiesLoading}
              selected={form.university}
              onSelect={form.selectUniversity}
              onClear={form.clearUniversity}
              graduated={form.graduated}
              onToggleGraduated={form.toggleGraduated}
              graduationYear={form.graduationYear}
              onSelectGraduationYear={form.selectGraduationYear}
            />
          )}
        </div>

        {showFooter ? (
          <OnboardingFooter
            isLast={form.isLast}
            disabled={!form.stepValid}
            submitting={form.submitting}
            onPress={form.next}
          />
        ) : null}
      </div>
    </main>
  )
}
