"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDashboardLinks, sharedLinks } from "@/components/app-shell/navigation";
import type { User } from "@/types";

export default function SidebarNav({
  role,
  mobile = false,
}: {
  role: User["role"];
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const navItems = [...(getDashboardLinks(role) ?? []), ...sharedLinks];

  return (
    <nav className={mobile ? "flex items-center gap-2 overflow-x-auto pb-1" : "space-y-1"}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={
              mobile
                ? `flex min-w-fit shrink-0 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium transition ${
                    active
                      ? "bg-primary text-white shadow-[0_14px_30px_-22px_rgba(16,185,129,0.9)]"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-primary-dark"
                  }`
                : `flex items-center gap-3 rounded-[1.15rem] px-3.5 py-3 text-sm transition ${
                    active
                      ? "bg-[linear-gradient(135deg,rgba(16,185,129,0.32),rgba(5,150,105,0.22))] text-white shadow-[0_18px_30px_-22px_rgba(15,23,42,0.8)] ring-1 ring-white/10"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`
            }
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
