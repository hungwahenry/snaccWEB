"use client"

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"
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

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<LightboxRequest | null>(null)
  const [index, setIndex] = useState(0)

  const open = useCallback((next: LightboxRequest) => {
    setRequest(next)
    setIndex(next.index)
  }, [])
  const close = useCallback(() => setRequest(null), [])
  const api = useMemo(() => ({ open, close }), [open, close])

  const count = request?.images.length ?? 0
  const step = useCallback(
    (by: number) =>
      setIndex((current) => (count === 0 ? 0 : (current + by + count) % count)),
    [count]
  )

  useEffect(() => {
    if (!request) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [request, step])

  const image = request?.images[index]

  return (
    <LightboxContext.Provider value={api}>
      {children}
      <Dialog open={request !== null} onOpenChange={(next) => !next && close()}>
        <DialogContent
          showCloseButton={false}
          className="flex h-dvh max-h-dvh w-screen max-w-none items-center justify-center rounded-none border-0 bg-black/95 p-0 shadow-none ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">Image</DialogTitle>
          {image ? (
            <img
              src={image.url}
              alt=""
              className="max-h-[92dvh] max-w-[96vw] object-contain select-none"
              draggable={false}
            />
          ) : null}

          <IconButton
            icon={XIcon}
            label="Close"
            onClick={close}
            className="absolute top-4 right-4 bg-white/10 text-white hover:bg-white/20"
          />

          {count > 1 ? (
            <>
              <IconButton
                icon={ChevronLeftIcon}
                label="Previous image"
                onClick={() => step(-1)}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
              />
              <IconButton
                icon={ChevronRightIcon}
                label="Next image"
                onClick={() => step(1)}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
              />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                {index + 1} / {count}
              </span>
            </>
          ) : null}

          {request?.footer ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-6 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
              {request.footer}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </LightboxContext.Provider>
  )
}
