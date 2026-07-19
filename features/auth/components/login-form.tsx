"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { getErrorMessage } from "@/lib/api/errors"
import { useLogin, useSendOtp } from "../hooks/use-auth"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [sent, setSent] = useState(false)
  const sendOtp = useSendOtp()
  const login = useLogin()

  function submitEmail(event: React.FormEvent) {
    event.preventDefault()
    sendOtp.mutate(email, {
      onSuccess: () => setSent(true),
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  function submitCode(event: React.FormEvent) {
    event.preventDefault()
    login.mutate(
      { email, code },
      {
        onSuccess: () => router.replace("/admin"),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Snacc Admin</CardTitle>
        <CardDescription>
          {sent ? `Enter the 6-digit code sent to ${email}` : "Sign in with your administrator email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!sent ? (
          <form onSubmit={submitEmail} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@snacc.app"
                autoFocus
                required
              />
            </Field>
            <Button type="submit" disabled={sendOtp.isPending || !email}>
              {sendOtp.isPending ? "Sending…" : "Send code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={submitCode} className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Verification code</FieldLabel>
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </Field>
            <Button type="submit" disabled={login.isPending || code.length < 6}>
              {login.isPending ? "Verifying…" : "Sign in"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSent(false)
                setCode("")
              }}
            >
              Use a different email
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
