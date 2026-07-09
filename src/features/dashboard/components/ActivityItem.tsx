"use client";

import React from "react";

export function ActivityItem({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  sub,
  time,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  sub: string;
  time: string;
}) {
  return (
    <div className="relative flex items-start gap-4 pb-6 last:pb-0 group">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border group-last:hidden" />
      
      <div className={`relative z-10 size-8 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 ring-4 ring-card`}>
        <Icon className={`size-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0 pt-1.5">
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex-shrink-0 bg-muted/50 px-2 py-0.5 rounded-full">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
