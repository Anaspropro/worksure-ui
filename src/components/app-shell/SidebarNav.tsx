"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { getDashboardLinks } from "@/components/app-shell/navigation";
import type { User } from "@/types";

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" as const },
  }),
};

export default function SidebarNav({
  role,
  onItemClick,
}: {
  role: User["role"];
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const navItems = [...(getDashboardLinks(role) ?? [])];

  return (
    <nav className="space-y-2 flex flex-col">
      {navItems.map(({ href, label, icon: Icon }, i) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <motion.div
            key={href}
            custom={i}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              href={href}
              onClick={onItemClick}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "text-primary"
                  : "text-white hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <Icon className="relative z-10 size-4 flex-shrink-0" />
              <span className="relative z-10 flex-1">{label}</span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
