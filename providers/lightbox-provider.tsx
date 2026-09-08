"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  StickerIcon,
  XIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"
import { PayCodePill } from "@/features/pay/components/pay-code-pill"
import { payPath } from "@/features/wallet/routes"
import { useImageZoom } from "@/hooks/use-image-zoom"
import { useSaveImage } from "@/hooks/use-save-image"
import { useStickerStudio } from "@/providers/sticker-studio-provider"

export interface LightboxImage {
  url: string
  width?: number
  height?: number
}

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

const OVERLAY_BUTTON =
  "bg-black/40 text-white hover:bg-black/60 disabled:opacity-50"

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<LightboxRequest | null>(null)
  const [index, setIndex] = useState(0)

  const open = useCallback((next: LightboxRequest) => {
    setRequest(next)
    setIndex(next.index)
  }, [])
  const close = useCallback(() => setRequest(null), [])
  const api = useMemo(() => ({ open, close }), [open, close])

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
            <Viewer
              request={request}
              index={index}
              onIndex={setIndex}
              onClose={close}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </LightboxContext.Provider>
  )
}

function Viewer({
  request,
  index,
  onIndex,
  onClose,
}: {
  request: LightboxRequest
  index: number
  onIndex: (next: number) => void
  onClose: () => void
}) {
  const router = useRouter()
  const studio = useStickerStudio()
  const { saving, save } = useSaveImage()
  const { attach: zoomRef, ...zoom } = useImageZoom()

  const images = request.images
  const count = images.length
  const image = images[index]

  const step = useCallback(
    (by: number) => {
      zoom.reset()
      onIndex(count === 0 ? 0 : (index + by + count) % count)
    },
    [count, index, onIndex, zoom]
  )

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [step])

  const canMakeSticker = !!studio && !!image?.width && !!image.height

  function makeSticker() {
    if (!studio || !image?.width || !image.height) return
    onClose()
    studio({ url: image.url, width: image.width, height: image.height })
  }

  function payWith(username: string) {
    onClose()
    router.push(payPath({ mode: "send", to: username }))
  }

  return (
    <>
      <div
        ref={zoomRef}
        {...zoom.handlers}
        className="flex size-full touch-none items-center justify-center overflow-hidden"
      >
        {image ? (
          <img
            src={image.url}
            alt=""
            draggable={false}
            style={zoom.style}
            className={
              zoom.zoomed
                ? "max-h-dvh max-w-full cursor-grab object-contain select-none active:cursor-grabbing"
                : "max-h-[92dvh] max-w-[96vw] object-contain select-none"
            }
          />
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)]">
        <IconButton
          icon={XIcon}
          label="Close"
          onClick={onClose}
          className={`pointer-events-auto ${OVERLAY_BUTTON}`}
        />

        <div className="pointer-events-auto flex items-center gap-3">
          {count > 1 ? (
            <span className="rounded-full bg-black/40 px-3 py-1 text-sm font-bold text-white">
              {index + 1} / {count}
            </span>
          ) : null}

          {canMakeSticker ? (
            <IconButton
              icon={StickerIcon}
              label="Make a sticker"
              onClick={makeSticker}
              className={OVERLAY_BUTTON}
            />
          ) : null}

          {image ? (
            saving ? (
              <span className="flex size-9 items-center justify-center rounded-full bg-black/40">
                <Spinner className="text-white" />
              </span>
            ) : (
              <IconButton
                icon={DownloadIcon}
                label="Save image"
                onClick={() => save(image.url)}
                className={OVERLAY_BUTTON}
              />
            )
          ) : null}
        </div>
      </div>

      {count > 1 ? (
        <>
          <IconButton
            icon={ChevronLeftIcon}
            label="Previous image"
            onClick={() => step(-1)}
            className={`absolute top-1/2 left-4 -translate-y-1/2 ${OVERLAY_BUTTON}`}
          />
          <IconButton
            icon={ChevronRightIcon}
            label="Next image"
            onClick={() => step(1)}
            className={`absolute top-1/2 right-4 -translate-y-1/2 ${OVERLAY_BUTTON}`}
          />
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col">
        <div className="pointer-events-auto flex justify-center px-4 pb-3">
          <PayCodePill url={image?.url ?? null} onPay={payWith} />
        </div>

        {request.footer ? (
          <div className="pointer-events-auto bg-gradient-to-t from-black/70 to-transparent px-5 pt-6 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
            {request.footer}
          </div>
        ) : null}
      </div>
    </>
  )
}
