"use client"

import { PencilIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { UserAvatar } from "@/components/ui/user-avatar"
import { composePath } from "@/features/snaccs/routes"
import { Confetti } from "./confetti"
import { PartyHat } from "./party-hat"

const PREFILL = "It's my birthday 🎂"

export function BirthdayWishDialog({
  open,
  onOpenChange,
  username,
  avatarUrl,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  username: string | null
  avatarUrl: string | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative overflow-hidden">
        <Confetti />

        <div className="relative flex flex-col items-center gap-5 py-2">
          <div className="relative size-28">
            <UserAvatar
              alt={username ?? "You"}
              avatarUrl={avatarUrl}
              name={username}
              className="size-28"
              textClassName="text-3xl"
            />
            <span className="absolute -top-5 -right-4 rotate-[24deg]">
              <PartyHat size={54} />
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <DialogTitle className="text-center text-3xl font-extrabold tracking-tight text-foreground">
              Happy birthday{username ? ` @${username}` : ""}
            </DialogTitle>
            <p className="max-w-xs text-center text-base leading-6 text-muted-foreground">
              From all of us at Snacc. Have the kind of day people post about.
            </p>
          </div>

          <div className="flex w-full flex-col gap-1">
            <Button
              size="lg"
              className="h-14 text-base"
              nativeButton={false}
              render={
                <Link href={composePath({ initialBody: PREFILL })}>
                  <PencilIcon /> Post about it
                </Link>
              }
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="py-3 text-sm font-medium text-muted-foreground transition-opacity active:opacity-70"
            >
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
