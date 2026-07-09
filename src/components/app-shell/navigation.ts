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
  History,
  Scale,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { User } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
}


export function getDashboardLinks(role: User["role"]) {
  return (
    {
      CLIENT: [
        { href: "/dashboard/client", label: "Dashboard", icon: LayoutDashboard },
        { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
        { href: "/contracts", label: "Contracts", icon: FileText },
        { href: "/dashboard/client/finances", label: "Finances", icon: CreditCard },
        { href: "/notifications", label: "Messages", icon: MessageSquare, badge: true },
        { href: "/profile", label: "Settings", icon: Settings },
      ],
      ARTISAN: [
        { href: "/dashboard/artisan", label: "Dashboard", icon: LayoutDashboard },
        { href: "/kyc/status", label: "Verification", icon: FileUser },
        { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
        { href: "/contracts", label: "Contracts", icon: FileText },
        { href: "/dashboard/artisan/earnings", label: "Earnings", icon: CreditCard },
        { href: "/notifications", label: "Messages", icon: MessageSquare, badge: true },
        { href: "/profile", label: "Settings", icon: Settings },
      ],
      ADMIN: [
        { href: "/admin", label: "Dashboard", icon: ShieldCheck },
        { href: "/admin/users", label: "Users", icon: ShieldPlus },
        { href: "/admin/kyc", label: "Verification", icon: FileUser },
        { href: "/admin/jobs", label: "Jobs", icon: BriefcaseBusiness },
        { href: "/admin/contracts", label: "Contracts", icon: FileText },
        { href: "/admin/disputes", label: "Disputes", icon: ShieldPlus },
        { href: "/admin/financial-operations", label: "Finances", icon: CreditCard },
        { href: "/admin/audit", label: "Audit Trail", icon: History },
      ],
    }[role] ?? []
  );
}
