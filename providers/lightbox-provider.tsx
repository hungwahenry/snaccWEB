"use client"

import { useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { LightboxViewer } from "@/components/ui/lightbox-viewer"
import type { LightboxImage } from "@/lib/lightbox/images"
import { PayCodePill } from "@/features/pay/components/pay-code-pill"
import { payPath } from "@/features/wallet/routes"
import { useSaveImage } from "@/hooks/use-save-image"
import { useStickerStudio } from "@/providers/sticker-studio-provider"

export type { LightboxImage }

interface LightboxRequest {
  images: LightboxImage[]
  index: number
  footer?: ReactNode
}

interface LightboxApi {
  open: (request: LightboxRequest) => void
  close: () => void
}

const LightboxContext = createContext<LightboxApi>({
  open: () => {},
  close: () => {},
})

export function useLightbox(): LightboxApi {
  return useContext(LightboxContext)
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const studio = useStickerStudio()
  const { saving, save } = useSaveImage()
  const [request, setRequest] = useState<LightboxRequest | null>(null)
  const [shown, setShown] = useState(false)
  const [opening, setOpening] = useState(0)
  const [index, setIndex] = useState(0)

  const open = useCallback((next: LightboxRequest) => {
    setRequest(next)
    setIndex(next.index)
    setOpening((count) => count + 1)
    setShown(true)
  }, [])
  const close = useCallback(() => setShown(false), [])
  const api = useMemo(() => ({ open, close }), [open, close])

  const image = request?.images[index]

  function makeSticker(target: LightboxImage) {
    if (!studio || !target.width || !target.height) return
    close()
    studio({ url: target.url, width: target.width, height: target.height })
  }

  function payWith(username: string) {
    close()
    router.push(payPath({ mode: "send", to: username }))
  }

  return (
    <LightboxContext.Provider value={api}>
      {children}
      <Dialog
        open={shown}
        onOpenChange={(next) => !next && close()}
        onOpenChangeComplete={(next) => !next && setRequest(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="flex h-dvh max-h-dvh w-screen max-w-none items-center justify-center overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">Image</DialogTitle>
          {request ? (
            <LightboxViewer
              key={opening}
              images={request.images}
              index={index}
              onIndex={setIndex}
              onClose={close}
              saving={saving}
              onSave={(target) => save(target.url)}
              onMakeSticker={studio ? makeSticker : undefined}
              payCode={<PayCodePill url={image?.url ?? null} onPay={payWith} />}
              footer={request.footer}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </LightboxContext.Provider>
  )
}
