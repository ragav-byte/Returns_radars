export function normalizeDecision(decision) {
  const value = (decision || "").toString().trim().toLowerCase();

  if (value === "accept" || value === "accepted" || value === "approved") {
    return "accept";
  }

  if (value === "reject" || value === "rejected" || value === "declined") {
    return "reject";
  }

  if (value.includes("manual") || value.includes("review") || value.includes("flag")) {
    return "review";
  }

  return "pending";
}

export function getDecisionLabel(decision) {
  const tone = normalizeDecision(decision);

  if (tone === "accept") {
    return "Approved";
  }

  if (tone === "reject") {
    return "Rejected";
  }

  if (tone === "review") {
    return "Manual Review";
  }

  return "Pending";
}

export function getDecisionClassName(decision) {
  return `decision-${normalizeDecision(decision)}`;
}
