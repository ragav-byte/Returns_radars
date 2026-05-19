import {
  getDecisionLabel,
  normalizeDecision,
} from "./utils/returnStatus";

test("maps manual verification results to the review state", () => {
  expect(normalizeDecision("Manual Verification")).toBe("review");
  expect(getDecisionLabel("Manual Verification")).toBe("Manual Review");
});
