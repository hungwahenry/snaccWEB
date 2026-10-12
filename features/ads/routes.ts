export const PROMOTIONS_PATH = "/promotions"

export const NEW_PROMOTION_PATH = `${PROMOTIONS_PATH}/new`

export const promotionPath = (id: string) =>
  `${PROMOTIONS_PATH}/${encodeURIComponent(id)}`

export const newPromotionPath = (snaccId: string) =>
  `${NEW_PROMOTION_PATH}?snacc=${encodeURIComponent(snaccId)}`
