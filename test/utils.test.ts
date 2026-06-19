import { describe, it, expect } from "vitest";
import { cn } from "../src/lib/utils";

describe("cn utility", () => {
  it("joins simple class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("merges Tailwind classes using tailwind-merge", () => {
    expect(cn("p-2 p-4")).toBe("p-4");
  });
});
