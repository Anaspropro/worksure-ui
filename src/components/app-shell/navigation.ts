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
  BarChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { User } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
}


export function getDashboardLinks(user: User) {
  const role = user.role;
  const adminRoles = user.adminRoles || [];
  
  const hasRole = (...roles: string[]) => {
    if (adminRoles.includes('SUPER_ADMIN')) return true;
    return roles.some(r => adminRoles.includes(r));
  };
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
        { href: "/verification", label: "Verification", icon: FileUser },
        { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
        { href: "/contracts", label: "Contracts", icon: FileText },
        { href: "/dashboard/artisan/earnings", label: "Earnings", icon: CreditCard },
        { href: "/notifications", label: "Messages", icon: MessageSquare, badge: true },
        { href: "/profile", label: "Settings", icon: Settings },
      ],
      ADMIN: [
        { href: "/admin", label: "Dashboard", icon: ShieldCheck },
        ...(hasRole('SUPER_ADMIN') ? [{ href: "/admin/settings", label: "Settings", icon: Settings }] : []),
        ...(hasRole('OPERATIONS_MANAGER', 'SUPPORT_ADMIN') ? [{ href: "/admin/users", label: "Users", icon: ShieldPlus }] : []),
        ...(hasRole('VERIFICATION_ADMIN') ? [{ href: "/admin/verification", label: "Verification", icon: FileUser }] : []),
        ...(hasRole('OPERATIONS_MANAGER', 'SUPPORT_ADMIN') ? [{ href: "/admin/jobs", label: "Jobs", icon: BriefcaseBusiness }] : []),
        ...(hasRole('OPERATIONS_MANAGER', 'SUPPORT_ADMIN', 'DISPUTE_ADMIN') ? [{ href: "/admin/contracts", label: "Contracts", icon: FileText }] : []),
        ...(hasRole('DISPUTE_ADMIN') ? [{ href: "/admin/disputes", label: "Disputes", icon: ShieldPlus }] : []),
        ...(hasRole('FINANCE_ADMIN') ? [{ href: "/admin/financial-operations", label: "Finances", icon: CreditCard }] : []),
        ...(hasRole('ANALYTICS_ADMIN') ? [{ href: "/admin/analytics", label: "Analytics", icon: BarChart }] : []),
        ...(hasRole('OPERATIONS_MANAGER') ? [{ href: "/admin/audit", label: "Audit Trail", icon: History }] : []),
      ],
    }[role] ?? []
  );
}
