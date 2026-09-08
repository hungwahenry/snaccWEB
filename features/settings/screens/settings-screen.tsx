"use client"

import {
  BanIcon,
  BookmarkIcon,
  ChevronRightIcon,
  FileTextIcon,
  FlagIcon,
  GhostIcon,
  InfoIcon,
  MailIcon,
  ShieldCheckIcon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { confirm } from "@/components/ui/confirm"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Spinner } from "@/components/ui/spinner"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useFlag } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1">
      <Eyebrow className="px-1 pb-1">{title}</Eyebrow>
      {children}
    </section>
  )
}

function Row({
  icon: Icon,
  label,
  href,
  external,
}: {
  icon: LucideIcon
  label: string
  href: string
  external?: boolean
}) {
  const className =
    "flex items-center gap-3 rounded-2xl py-3.5 transition-colors hover:bg-accent/40 active:opacity-60"
  const body = (
    <>
      <Icon className="size-5 text-muted-foreground" />
      <span className="flex-1 text-base text-foreground">{label}</span>
      <ChevronRightIcon className="size-5 text-muted-foreground" />
    </>
  )
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {body}
    </Link>
  )
}

export function SettingsScreen() {
  const back = useBack()
  const logout = useLogout()
  const messagesEnabled = useFlag("anon_messages")

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
        <Section title="Content">
          <Row icon={BookmarkIcon} label="Saved snaccs" href="/saved" />
        </Section>

        <Section title="Account">
          <Row icon={MailIcon} label="Change email" href="/settings/email" />
          <Row icon={UserRoundIcon} label="Edit profile" href="/edit-profile" />
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

        <Section title="Safety">
          <Row
            icon={BanIcon}
            label="Blocked accounts"
            href="/settings/blocked"
          />
          <Row icon={FlagIcon} label="Your reports" href="/settings/reports" />
        </Section>

        <Section title="About">
          <Row icon={InfoIcon} label="About Snacc" href="/" />
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
      </div>
    </>
  )
}
