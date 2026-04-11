import {
  Bell,
  BriefcaseBusiness,
  FileText,
  FileUser,
  LayoutDashboard,
  MessageSquareQuote,
  ShieldCheck,
  ShieldPlus,
  UserRound,
  Wallet,
} from "lucide-react";
import type { User } from "@/types";

export const sharedLinks = [
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/reviews", label: "Reviews", icon: MessageSquareQuote },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/wallet", label: "Wallet", icon: Wallet },
];

export function getDashboardLinks(role: User["role"]) {
  return {
    CLIENT: [{ href: "/dashboard/client", label: "Dashboard", icon: LayoutDashboard }],
    ARTISAN: [
      { href: "/dashboard/artisan", label: "Dashboard", icon: LayoutDashboard },
      { href: "/kyc/status", label: "Verification", icon: FileUser },
    ],
    ADMIN: [
      { href: "/dashboard/admin", label: "Dashboard", icon: ShieldCheck },
      { href: "/admin/users", label: "Users", icon: ShieldPlus },
      { href: "/admin/disputes", label: "Disputes", icon: FileText },
    ],
  }[role];
}
