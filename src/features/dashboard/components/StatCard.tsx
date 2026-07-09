"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="relative p-5 flex items-start justify-between gap-4 z-10">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {sub && (
            <p className="text-xs text-primary/80 font-medium cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
              {sub} <ChevronRight className="size-3" />
            </p>
          )}
        </div>
        <div className={`rounded-2xl ${iconBg} p-3 flex-shrink-0 ring-1 ring-black/5 dark:ring-white/5`}>
          <Icon className={`size-5 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
}
