"use client"

import { CopyIcon, ShareIcon } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { PersonAvatar } from "@/features/users/components/person-avatar"
import { nameOf } from "@/features/users/utils/names"
import type { InvitePanelModel } from "../hooks/use-invite-screen"
import { ClaimCodeForm } from "./claim-code-form"

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl bg-muted py-3">
      <span className="text-xl font-extrabold text-foreground tabular-nums">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function InvitePanel({
  code,
  shownLink,
  blurb,
  stats,
  referredBy,
  claim,
  onCopy,
  onShare,
}: InvitePanelModel) {
  return (
    <div className="flex flex-col gap-6 px-6 pt-6 pb-3">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Eyebrow>Invite friends</Eyebrow>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Bring your friends
        </h1>
        <p className="text-sm text-muted-foreground">{blurb}</p>
      </div>

      <div className="flex flex-col items-center gap-5 rounded-3xl bg-primary p-6">
        <div className="flex flex-col items-center gap-1">
          <Eyebrow className="text-primary-foreground/70">Your code</Eyebrow>
          <p className="text-4xl font-extrabold tracking-widest text-primary-foreground tabular-nums select-all">
            {code}
          </p>
          <p className="text-sm text-primary-foreground/70">{shownLink}</p>
        </div>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy your invite link"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary-foreground text-sm font-extrabold text-primary transition-opacity active:opacity-80"
          >
            <CopyIcon className="size-[18px]" /> Copy link
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Share your invite link"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary-foreground/30 text-sm font-extrabold text-primary-foreground transition-opacity active:opacity-70"
          >
            <ShareIcon className="size-[18px]" /> Share
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Stat value={stats.invited} label="Invited" />
        <Stat value={stats.paid} label="Paid" />
        <Stat value={stats.earned} label="Earned" />
      </div>

      {referredBy ? (
        <div className="flex items-center gap-3">
          <PersonAvatar person={referredBy} className="size-10" />
          <p className="text-sm text-muted-foreground">
            You joined with{" "}
            <span className="font-bold text-foreground">
              {nameOf(referredBy)}
            </span>
            ’s invite
          </p>
        </div>
      ) : claim ? (
        <ClaimCodeForm form={claim.form} hint={claim.hint} />
      ) : null}

      <Eyebrow>Friends who joined</Eyebrow>
    </div>
  )
}
