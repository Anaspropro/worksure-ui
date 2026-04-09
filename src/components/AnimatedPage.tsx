"use client";

import React from "react";

export default function AnimatedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-full">{children}</div>;
}
