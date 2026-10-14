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
  phone: "555 010 9999",
  idNumber: "123456",
  accountNumber: "12345678",
  bank: { name: "First Test Bank", code: "001" },
}

describe("digitsOnly and cleanPhone", () => {
  it("keeps digits up to a length", () => {
    expect(digitsOnly("12a34-5", 4)).toBe("1234")
  })

  it("drops spaces, brackets and dashes from a phone number", () => {
    expect(cleanPhone("(555) 010-9999")).toBe("5550109999")
  })
})

describe("activationMissing", () => {
  const off = { id: null, accountNumberLength: 8, resolved: false }
  const on = {
    id: { name: "Tax number", length: 6 },
    accountNumberLength: 8,
    resolved: true,
  }

  it("asks for things in the order the form does", () => {
    expect(activationMissing(EMPTY_ACTIVATION, off)).toBe("first name")
    expect(activationMissing({ ...ready, lastName: "O" }, off)).toBe(
      "last name"
    )
    expect(activationMissing({ ...ready, phone: "123" }, off)).toBe(
      "phone number"
    )
  })

  it("stops at the phone number where no ID is checked", () => {
    expect(activationMissing({ ...ready, idNumber: "" }, off)).toBeNull()
  })

  it("needs the country's ID, an account, its bank and a resolved name otherwise", () => {
    expect(activationMissing({ ...ready, idNumber: "1" }, on)).toBe(
      "Tax number"
    )
    expect(activationMissing({ ...ready, accountNumber: "1" }, on)).toBe(
      "an account you own"
    )
    expect(activationMissing({ ...ready, bank: null }, on)).toBe("its bank")
    expect(activationMissing(ready, { ...on, resolved: false })).toBe(
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
      phone: "5550109999",
    })
  })

  it("adds identity details only when they are checked", () => {
    expect(activationInput(ready, true)).toMatchObject({
      idNumber: "123456",
      accountNumber: "12345678",
      bankCode: "001",
    })
  })
})
