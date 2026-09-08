import { XIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { IconButton } from "@/components/ui/icon-button"

export function ViewOnceViewer({
  url,
  onClose,
}: {
  url: string | null
  onClose: () => void
}) {
  return (
    <Dialog open={url !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex h-dvh max-h-dvh w-screen max-w-none flex-col items-center justify-center rounded-none border-0 bg-black p-0 shadow-none ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">View once photo</DialogTitle>
        {url ? (
          <img
            src={url}
            alt=""
            className="max-h-[88dvh] max-w-[96vw] object-contain select-none"
            draggable={false}
            onClick={onClose}
          />
        ) : null}
        <IconButton
          icon={XIcon}
          label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/15 text-white hover:bg-white/25"
        />
        <p className="absolute bottom-6 px-6 text-center text-xs text-white/70">
          Closing deletes this photo.
        </p>
      </DialogContent>
    </Dialog>
  )
}
