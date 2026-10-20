import { describe, expect, test } from "bun:test"

import { centsToEuroInput, euroInputToCents } from "./money"

describe("euroInputToCents", () => {
  test("rounds float noise to the nearest cent", () => {
    // 19.99 * 100 is 1998.9999999999998 in IEEE 754.
    expect(euroInputToCents("19.99")).toBe(1999)
    expect(euroInputToCents("0.1")).toBe(10)
  })

  test("reads a blank or unparseable field as 0, never NaN", () => {
    expect(euroInputToCents("")).toBe(0)
    expect(euroInputToCents("abc")).toBe(0)
  })
})

describe("centsToEuroInput", () => {
  test("writes the value a number input expects", () => {
    expect(centsToEuroInput(1250)).toBe("12.5")
    expect(centsToEuroInput(0)).toBe("0")
  })

  test("round-trips every cent amount without drift", () => {
    for (let cents = 0; cents <= 100_000; cents += 7) {
      expect(euroInputToCents(centsToEuroInput(cents))).toBe(cents)
    }
  })
})
