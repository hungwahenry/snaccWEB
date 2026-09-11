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
import {
  LightboxViewer,
  type LightboxImage,
} from "@/components/ui/lightbox-viewer"
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
  const [index, setIndex] = useState(0)

  const open = useCallback((next: LightboxRequest) => {
    setRequest(next)
    setIndex(next.index)
  }, [])
  const close = useCallback(() => setRequest(null), [])
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
      <Dialog open={request !== null} onOpenChange={(next) => !next && close()}>
        <DialogContent
          showCloseButton={false}
          className="flex h-dvh max-h-dvh w-screen max-w-none items-center justify-center overflow-hidden rounded-none border-0 bg-black/95 p-0 shadow-none ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">Image</DialogTitle>
          {request ? (
            <LightboxViewer
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
