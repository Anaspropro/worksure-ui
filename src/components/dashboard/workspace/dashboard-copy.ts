import type { User } from "@/types";

export function getScreenCopy(roleView: User["role"]) {
  if (roleView === "CLIENT") {
    return {
      title: "Client workspace",
      description:
        "Create jobs, review proposals, fund escrow, and release payment with clear status visibility at each step.",
      emphasis: "Escrow protection",
    };
  }

  if (roleView === "ARTISAN") {
    return {
      title: "Artisan workspace",
      description:
        "Track open jobs, submit proposals, and manage funded contracts with confidence about payout progress.",
      emphasis: "Funded work flow",
    };
  }

  return {
    title: "Admin workspace",
    description:
      "Monitor live marketplace activity and maintain trust across contracts, users, verification, and disputes.",
    emphasis: "Trust oversight",
  };
}

export const workflowSteps = [
  { label: "Fund escrow", icon: "wallet" },
  { label: "Work in progress", icon: "progress" },
  { label: "Confirm completion", icon: "check" },
  { label: "Release payment", icon: "check" },
] as const;
