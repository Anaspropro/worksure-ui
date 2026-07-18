"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDashboardLinks } from "@/components/app-shell/navigation";
import type { User } from "@/types";

export default function SidebarNav({
  user,
  onItemClick,
}: {
  user: User;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const navItems = [...(getDashboardLinks(user) ?? [])];

  return (
    <nav className="space-y-2 flex flex-col">
      {navItems.map(({ href, label, icon: Icon }, i) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <div key={href}>
            <Link
              href={href}
              onClick={onItemClick}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "text-primary bg-primary/10"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="relative z-10 size-4 flex-shrink-0" />
              <span className="relative z-10 flex-1">{label}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
