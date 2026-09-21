import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { HANGOUT_GUIDELINES_PATH } from "@/lib/routes"

export function HangoutGateDialog({
  open,
  pending,
  onAgree,
  onDismiss,
}: {
  open: boolean
  pending: boolean
  onAgree: () => void
  onDismiss: () => void
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => (next ? null : onDismiss())}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <span className="text-3xl" aria-hidden>
              🤝
            </span>
          </AlertDialogMedia>
          <AlertDialogTitle className="font-extrabold tracking-tight">
            Before you meet up
          </AlertDialogTitle>
          <AlertDialogDescription>
            Hangouts are plans to meet people in person, for people 18 or older.
            Meet somewhere public, tell a friend where you&apos;re going, and
            leave if anything feels off.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <Button size="lg" disabled={pending} onClick={onAgree}>
            {pending ? <Spinner /> : "I'm 18 or older"}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            nativeButton={false}
            render={
              <a
                href={HANGOUT_GUIDELINES_PATH}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Read the meet-up rules
          </Button>
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={onDismiss}
          >
            Not now
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
