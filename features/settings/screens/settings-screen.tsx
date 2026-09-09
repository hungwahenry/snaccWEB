"use client"

import {
  BanIcon,
  BookmarkIcon,
  ChartNoAxesColumnIcon,
  CoinsIcon,
  DownloadIcon,
  EggIcon,
  FileTextIcon,
  FlagIcon,
  GemIcon,
  GhostIcon,
  HandCoinsIcon,
  HeartIcon,
  InfoIcon,
  MailIcon,
  PaletteIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UserRoundIcon,
  WalletIcon,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { confirm } from "@/components/ui/confirm"
import { Spinner } from "@/components/ui/spinner"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { EGGS_PATH } from "@/features/eggs/routes"
import { INSIGHTS_PATH } from "@/features/insights/routes"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { BackHeader } from "@/features/navigation/components/back-header"
import {
  EARNINGS_PATH,
  MONEY_SETTINGS_PATH,
  WALLET_PATH,
} from "@/features/wallet/routes"
import { useBack } from "@/hooks/use-back"
import { hasAdminAccess } from "@/lib/permissions"
import { Row, Section } from "../components/rows"

export function SettingsScreen() {
  const back = useBack()
  const logout = useLogout()
  const moderator = hasAdminAccess(useMe().data?.permissions)
  const messagesEnabled = useFlag("anon_messages")
  const accentsEnabled = useFlag("accent_colors")
  const earningsEnabled = useFlag("earnings")
  const walletEnabled = useFlag("wallet")
  const premiumEnabled = useFlag("premium")
  const eggsEnabled = useFlag("easter_eggs")

  function confirmLogout() {
    confirm({
      title: "Log out?",
      message: "You can always sign back in.",
      actions: [
        { label: "Log out", destructive: true, onPress: () => logout.mutate() },
      ],
    })
  }

  return (
    <>
      <BackHeader title="Settings" onBack={back} />

      <div className="flex flex-col gap-5 px-6 py-6">
        {premiumEnabled ? (
          <Section title="Premium">
            <Row icon={GemIcon} label="Snacc Premium" href={PREMIUM_PATH} />
            <Row
              icon={ChartNoAxesColumnIcon}
              label="Insights"
              href={INSIGHTS_PATH}
            />
          </Section>
        ) : null}

        {earningsEnabled || walletEnabled ? (
          <Section title="Money">
            {earningsEnabled && walletEnabled ? (
              <Row icon={CoinsIcon} label="Monetisation" href={EARNINGS_PATH} />
            ) : null}
            {walletEnabled ? (
              <Row
                icon={HandCoinsIcon}
                label="Money settings"
                href={MONEY_SETTINGS_PATH}
              />
            ) : (
              <Row icon={WalletIcon} label="Wallet" href={WALLET_PATH} />
            )}
          </Section>
        ) : null}

        <Section title="Content">
          <Row icon={BookmarkIcon} label="Saved snaccs" href="/saved" />
          {eggsEnabled ? (
            <Row icon={EggIcon} label="Easter eggs" href={EGGS_PATH} />
          ) : null}
          {accentsEnabled ? (
            <Row
              icon={PaletteIcon}
              label="Appearance"
              href="/settings/appearance"
            />
          ) : null}
        </Section>

        <Section title="Account">
          <Row icon={MailIcon} label="Change email" href="/settings/email" />
          <Row icon={UserRoundIcon} label="Edit profile" href="/edit-profile" />
          <Row
            icon={DownloadIcon}
            label="Download your data"
            href="/settings/export"
          />
        </Section>

        {messagesEnabled ? (
          <Section title="Privacy">
            <Row
              icon={GhostIcon}
              label="Anonymous messages"
              href="/settings/privacy"
            />
          </Section>
        ) : null}

        {moderator ? (
          <Section title="Moderation">
            <Row icon={ShieldIcon} label="Moderator tools" href="/admin" />
          </Section>
        ) : null}

        <Section title="Safety">
          <Row
            icon={BanIcon}
            label="Blocked accounts"
            href="/settings/blocked"
          />
          <Row icon={FlagIcon} label="Your reports" href="/settings/reports" />
        </Section>

        <Section title="Preferences">
          <Row
            icon={HeartIcon}
            label="Notifications"
            href="/settings/notifications"
          />
        </Section>

        <Section title="About">
          <Row icon={InfoIcon} label="About Snacc" href="/settings/about" />
          <Row icon={FileTextIcon} label="Terms of Use" href="/terms" />
          <Row icon={ShieldCheckIcon} label="Privacy Policy" href="/privacy" />
        </Section>

        <Button
          variant="outline"
          size="lg"
          className="mt-2 h-14 text-base"
          disabled={logout.isPending}
          onClick={confirmLogout}
        >
          {logout.isPending ? <Spinner /> : "Log out"}
        </Button>

        <Link
          href="/settings/delete"
          className="py-3 text-center text-base font-bold text-destructive transition-opacity active:opacity-60"
        >
          Delete account
        </Link>
      </div>
    </>
  )
}
