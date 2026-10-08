import type { Gif } from "@/features/giphy/types"
import type {
  Sticker,
  StickerAttachment,
  StickerPick,
  StickerSendFields,
} from "../types"

export function pickOfSticker(sticker: Sticker): StickerPick {
  return {
    kind: "pack",
    stickerId: sticker.id,
    url: sticker.url,
    preview_url: sticker.preview_url,
    width: sticker.width,
    height: sticker.height,
  }
}

export function pickOfGiphy(gif: Gif): StickerPick {
  return {
    kind: "giphy",
    giphyId: gif.id,
    url: gif.url,
    preview_url: gif.preview_url,
    width: gif.width,
    height: gif.height,
  }
}

export function pickOfAttachment(
  attachment: StickerAttachment | null
): StickerPick | null {
  if (!attachment || attachment.removed || !attachment.url) return null
  const image = {
    url: attachment.url,
    preview_url: attachment.preview_url,
    width: attachment.width,
    height: attachment.height,
  }
  if (attachment.sticker_id)
    return { kind: "pack", stickerId: attachment.sticker_id, ...image }
  if (attachment.giphy_id)
    return { kind: "giphy", giphyId: attachment.giphy_id, ...image }
  return null
}

export function stickerFields(pick: StickerPick | null): StickerSendFields {
  if (!pick) return {}
  return pick.kind === "pack"
    ? { stickerId: pick.stickerId }
    : { giphyStickerId: pick.giphyId }
}

export function attachmentOfPick(pick: StickerPick): StickerAttachment {
  return {
    sticker_id: pick.kind === "pack" ? pick.stickerId : null,
    pack_id: null,
    giphy_id: pick.kind === "giphy" ? pick.giphyId : null,
    url: pick.url,
    preview_url: pick.preview_url,
    width: pick.width,
    height: pick.height,
    removed: false,
  }
}
