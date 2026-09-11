import { describe, expect, it } from "vitest"
import {
  activationInput,
  activationMissing,
  cleanPhone,
  digitsOnly,
  EMPTY_ACTIVATION,
  type ActivationFields,
} from "./activation"

const ready: ActivationFields = {
  firstName: " Ada ",
  lastName: "Obi",
  phone: "0803 123 4567",
  bvn: "12345678901",
  accountNumber: "0123456789",
  bank: { name: "GTBank", code: "058" },
}

describe("digitsOnly and cleanPhone", () => {
  it("keeps digits up to a length", () => {
    expect(digitsOnly("12a34-5", 4)).toBe("1234")
  })

  it("drops spaces, brackets and dashes from a phone number", () => {
    expect(cleanPhone("(0803) 123-4567")).toBe("08031234567")
  })
})

describe("activationMissing", () => {
  const off = { required: false, resolved: false }
  const on = { required: true, resolved: true }

  it("asks for things in the order the form does", () => {
    expect(activationMissing(EMPTY_ACTIVATION, off)).toBe("first name")
    expect(activationMissing({ ...ready, lastName: "O" }, off)).toBe(
      "last name"
    )
    expect(activationMissing({ ...ready, phone: "123" }, off)).toBe(
      "phone number"
    )
  })

  it("stops at the phone number when identity is not needed", () => {
    expect(activationMissing({ ...ready, bvn: "" }, off)).toBeNull()
  })

  it("needs the BVN, an account, its bank and a resolved name otherwise", () => {
    expect(activationMissing({ ...ready, bvn: "1" }, on)).toBe("BVN")
    expect(activationMissing({ ...ready, accountNumber: "1" }, on)).toBe(
      "an account you own"
    )
    expect(activationMissing({ ...ready, bank: null }, on)).toBe("its bank")
    expect(activationMissing(ready, { required: true, resolved: false })).toBe(
      "a valid account"
    )
    expect(activationMissing(ready, on)).toBeNull()
  })
})

describe("activationInput", () => {
  it("trims names and cleans the phone", () => {
    expect(activationInput(ready, false)).toEqual({
      firstName: "Ada",
      lastName: "Obi",
      phone: "08031234567",
    })
  })

  it("adds identity details only when they are needed", () => {
    expect(activationInput(ready, true)).toMatchObject({
      bvn: "12345678901",
      accountNumber: "0123456789",
      bankCode: "058",
    })
  })
})
