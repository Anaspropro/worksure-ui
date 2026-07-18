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
    <Card className="group relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
      <CardContent className="p-3 sm:p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className={`rounded-lg ${iconBg} p-1.5 flex-shrink-0`}>
              <Icon className={`size-3.5 ${iconColor}`} />
            </div>
            <p className="text-xs font-semibold text-foreground">{label}</p>
          </div>
          <button className="text-muted-foreground hover:bg-muted p-0.5 rounded-md transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
        
        <div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>

        {sub && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
              +3.2% 
            </span>
            <span className="text-xs text-muted-foreground">{sub}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
