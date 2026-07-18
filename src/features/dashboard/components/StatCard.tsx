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
    <Card className="group relative overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl ${iconBg} p-2 flex-shrink-0`}>
              <Icon className={`size-4 ${iconColor}`} />
            </div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
          </div>
          <button className="text-muted-foreground hover:bg-muted p-1 rounded-md transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
        
        <div>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>

        {sub && (
          <div className="flex items-center gap-2 mt-1">
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
