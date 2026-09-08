import { z } from "zod"

export const OTP_LENGTH = 6

export const emailSchema = z.object({
  email: z.string().trim().email("Enter a valid email.").max(255),
})
