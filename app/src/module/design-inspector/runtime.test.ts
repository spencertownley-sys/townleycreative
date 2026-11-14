import { describe, expect, test } from "bun:test";

import { isAllowedParentOrigin } from "./runtime";

describe("isAllowedParentOrigin", () => {
  test("accepts the Higgsfield editor origin and its subdomains", () => {
    expect(isAllowedParentOrigin("https://higgsfield.ai")).toBe(true);
    expect(isAllowedParentOrigin("https://app.higgsfield.ai")).toBe(true);
  });

  test("rejects other origins", () => {
    expect(isAllowedParentOrigin("https://example.com")).toBe(false);
    expect(isAllowedParentOrigin("https://higgsfield.ai.evil.com")).toBe(false);
    expect(isAllowedParentOrigin("http://app.higgsfield.ai")).toBe(false);
    expect(isAllowedParentOrigin("null")).toBe(false);
  });
});
