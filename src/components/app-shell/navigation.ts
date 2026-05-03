import {
  BriefcaseBusiness,
  CreditCard,
  FileText,
  FileUser,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldCheck,
  ShieldPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { User } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
}

export const sharedLinks: NavItem[] = [
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/wallet", label: "Payments", icon: CreditCard },
  { href: "/notifications", label: "Messages", icon: MessageSquare, badge: true },
  { href: "/profile", label: "Settings", icon: Settings },
];

export function getDashboardLinks(role: User["role"]): NavItem[] {
  return (
    {
      CLIENT: [{ href: "/dashboard/client", label: "Dashboard", icon: LayoutDashboard }],
      ARTISAN: [
        { href: "/dashboard/artisan", label: "Dashboard", icon: LayoutDashboard },
        { href: "/kyc/status", label: "Verification", icon: FileUser },
      ],
      ADMIN: [
        { href: "/dashboard/admin", label: "Dashboard", icon: ShieldCheck },
        { href: "/admin/users", label: "Users", icon: ShieldPlus },
        { href: "/admin/kyc", label: "Verification", icon: FileUser },
        { href: "/admin/disputes", label: "Disputes", icon: FileText },
      ],
    }[role] ?? []
  );
}
