export const adminPaymentMarketKeys = {
  all: () => ["admin", "payment-markets"] as const,
  list: () => ["admin", "payment-markets", "list"] as const,
  providers: () => ["admin", "payment-markets", "providers"] as const,
}
