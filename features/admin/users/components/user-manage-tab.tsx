"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { ExternalLink, ShieldAlert } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import type { AdminGrant } from "@/features/admin/roles/types"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { Section } from "@/features/admin/shell/components/detail"
import {
  SettingGroup,
  SettingRow,
} from "@/features/admin/shell/components/setting-row"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { walletPath } from "@/features/admin/shell/routes"
import type { Option } from "@/features/admin/shell/types"
import type { SuspensionReason } from "@/features/admin/suspension-reasons/types"
import { formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AdminUserDetail, UserActions } from "../types"
import {
  accountStatus,
  earningSummary,
  payoutSummary,
  suspensionSummary,
} from "../utils/users"
import { AdjustEarningsDialog } from "./adjust-earnings-dialog"
import { CampusDialog } from "./campus-dialog"
import { RolesDialog } from "./roles-dialog"
import { SuspendDialog } from "./suspend-dialog"

function Group({
  title,
  description,
  danger = false,
  children,
}: {
  title: ReactNode
  description: string
  danger?: boolean
  children: ReactNode
}) {
  return (
    <Section title={title} description={description}>
      <div
        className={cn("rounded-lg border", danger && "border-destructive/40")}
      >
        <SettingGroup>{children}</SettingGroup>
      </div>
    </Section>
  )
}

export function UserManageTab({
  user,
  actions,
  campuses,
  suspension,
  roles,
}: {
  user: AdminUserDetail
  actions: UserActions
  campuses: Option[]
  suspension: { reasons: SuspensionReason[]; durations: Option[] }
  roles: {
    grants: UseQueryResult<AdminGrant[]>
    grantable: Option[]
    grant: (roleId: string) => Promise<unknown>
    revoke: (roleId: string) => Promise<unknown>
  }
}) {
  return (
    <div className="flex flex-col gap-6">
      <Group
        title="Access"
        description="Whether they can use the app, and on which devices."
      >
        <SettingRow
          label="Account"
          state={<StatusBadge status={accountStatus(user)} />}
          description={suspensionSummary(user)}
          action={
            <CanAct permission="users.suspend">
              {user.suspended_at ? (
                <ConfirmAction
                  trigger={
                    <Button variant="outline" size="sm">
                      Lift suspension
                    </Button>
                  }
                  tone="default"
                  title="Lift this suspension?"
                  description="They can post, message and earn again straight away."
                  confirmLabel="Lift it"
                  onConfirm={() => actions.unsuspend()}
                />
              ) : (
                <SuspendDialog
                  reasons={suspension.reasons}
                  durations={suspension.durations}
                  trigger={
                    <Button variant="outline" size="sm">
                      Suspend
                    </Button>
                  }
                  onSubmit={actions.suspend}
                />
              )}
            </CanAct>
          }
        />
        <SettingRow
          label="Devices"
          description="Signs them out everywhere. They can sign back in with a fresh code."
          action={
            <CanAct permission="users.revoke_sessions">
              <ConfirmAction
                trigger={
                  <Button variant="outline" size="sm">
                    Sign out everywhere
                  </Button>
                }
                title="Sign this account out everywhere?"
                description="Every device is signed out straight away. They can sign back in with a fresh code."
                confirmLabel="Sign them out"
                onConfirm={() => actions.signOut()}
              />
            </CanAct>
          }
        />
        <SettingRow
          label="Panel roles"
          state={
            user.role === "admin" ? <Badge>Owner account</Badge> : undefined
          }
          description="What they can reach and do in this panel."
          action={
            <CanAct permission="roles.grant">
              <RolesDialog
                grants={roles.grants}
                grantable={roles.grantable}
                trigger={
                  <Button variant="outline" size="sm">
                    Roles
                  </Button>
                }
                onGrant={roles.grant}
                onRevoke={roles.revoke}
              />
            </CanAct>
          }
        />
        <SettingRow
          label="Campus"
          state={
            <Badge variant="outline">
              {user.university?.acronym ?? "None"}
            </Badge>
          }
          description="Which university the account belongs to."
          action={
            <CanAct permission="users.set_university">
              <CampusDialog
                currentId={user.university?.id ?? null}
                campuses={campuses}
                trigger={
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                }
                onSubmit={actions.moveCampus}
              />
            </CanAct>
          }
        />
      </Group>

      <Group
        title="Money"
        description="Two separate balances. Unclaimed earnings are what they have been paid for engagement; the wallet is what they can actually spend."
      >
        <SettingRow
          label="Unclaimed earnings"
          state={
            <span className="text-sm font-semibold tabular-nums">
              {formatNaira(user.earnings.balance)}
            </span>
          }
          description="Not spendable until they claim it, which their milestones have to allow."
          action={
            <CanAct permission="users.adjust_balance">
              <AdjustEarningsDialog
                balance={user.earnings.balance}
                trigger={
                  <Button variant="outline" size="sm">
                    Adjust
                  </Button>
                }
                onSubmit={actions.adjust}
              />
            </CanAct>
          }
        />
        <SettingRow
          label="Wallet"
          description="Spendable money, backed by the ledger. Corrections to it are made from the wallet page."
          action={
            <CanAct permission="wallet.read">
              <Button
                variant="outline"
                size="sm"
                render={<Link href={walletPath(user.id)} />}
              >
                Open wallet
                <ExternalLink />
              </Button>
            </CanAct>
          }
        />
        <SettingRow
          label="Earning"
          state={
            <Badge variant="secondary">
              {user.earnings_paused_at ? "Paused" : "On"}
            </Badge>
          }
          description={earningSummary(user)}
          action={
            <CanAct permission="users.moderate_earnings">
              {user.earnings_paused_at ? (
                <ActionButton
                  variant="outline"
                  size="sm"
                  onClick={() => actions.resume()}
                >
                  Resume
                </ActionButton>
              ) : (
                <ConfirmAction
                  trigger={
                    <Button variant="outline" size="sm">
                      Pause
                    </Button>
                  }
                  title="Pause their earning?"
                  description="New engagement stops paying them. The account stays fully active and keeps what it already has."
                  confirmLabel="Pause earning"
                  reason={{ label: "Why" }}
                  onConfirm={(reason) => actions.pause(reason)}
                />
              )}
            </CanAct>
          }
        />
        <SettingRow
          label="Withdrawals"
          state={
            <Badge
              variant={user.payouts_blocked_at ? "destructive" : "secondary"}
            >
              {user.payouts_blocked_at ? "Blocked" : "Allowed"}
            </Badge>
          }
          description={payoutSummary(user)}
          action={
            <CanAct permission="users.moderate_payouts">
              {user.payouts_blocked_at ? (
                <ActionButton
                  variant="outline"
                  size="sm"
                  onClick={() => actions.unblock()}
                >
                  Allow again
                </ActionButton>
              ) : (
                <ConfirmAction
                  trigger={
                    <Button variant="outline" size="sm">
                      Block
                    </Button>
                  }
                  title="Block their withdrawals?"
                  description="They can no longer cash out to a bank. Their balance stays where it is."
                  confirmLabel="Block withdrawals"
                  reason={{ label: "Why" }}
                  onConfirm={(reason) => actions.block(reason)}
                />
              )}
            </CanAct>
          }
        />
      </Group>

      <Group title="Reach" description="How far this account's snaccs travel.">
        <SettingRow
          label="Audience"
          state={
            <Badge variant={user.posts_globally ? "default" : "outline"}>
              {user.posts_globally ? "Every campus" : "Own campus"}
            </Badge>
          }
          description={
            user.posts_globally
              ? "Their snaccs appear on every campus feed, and they do not earn."
              : "Their snaccs stay on their own campus feed."
          }
          action={
            <CanAct permission="users.set_global">
              {user.posts_globally ? (
                <ConfirmAction
                  trigger={
                    <Button variant="outline" size="sm">
                      Keep to their campus
                    </Button>
                  }
                  tone="default"
                  title="Keep this account to its campus?"
                  description="Its snaccs leave every other campus feed and go back to its own, and it starts earning again."
                  confirmLabel="Keep to campus"
                  onConfirm={() => actions.bindToCampus()}
                />
              ) : (
                <ConfirmAction
                  trigger={
                    <Button variant="outline" size="sm">
                      Post everywhere
                    </Button>
                  }
                  tone="default"
                  title="Show this account on every campus?"
                  description="Its snaccs appear on every campus feed, including the ones it has already posted. It stops earning, because an account every campus sees would otherwise out-earn all of them."
                  confirmLabel="Post everywhere"
                  onConfirm={() => actions.postEverywhere()}
                />
              )}
            </CanAct>
          }
        />
      </Group>

      <Group
        danger
        title={
          <span className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="size-4" aria-hidden />
            Danger zone
          </span>
        }
        description="This cannot be undone."
      >
        <SettingRow
          tone="danger"
          label="Delete account"
          description="Removes the account and everything attached to it, and unwinds its counts on the way out."
          action={
            <CanAct permission="users.delete">
              <ConfirmAction
                trigger={
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                }
                title="Delete this account for good?"
                description="The account and everything attached to it are removed. There is no way back."
                confirmLabel="Delete forever"
                typeToConfirm={user.email}
                onConfirm={() => actions.remove(user.email)}
              />
            </CanAct>
          }
        />
      </Group>
    </div>
  )
}
