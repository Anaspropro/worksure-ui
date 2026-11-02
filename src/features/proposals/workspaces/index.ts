import dynamic from "next/dynamic";
import React from "react";

const WorkspaceSkeleton = () =>
  React.createElement(
    "div",
    { className: "p-6 space-y-4 animate-pulse" },
    React.createElement("div", { className: "h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded" }),
    React.createElement("div", { className: "h-48 w-full bg-slate-200 dark:bg-slate-700 rounded" }),
  );

export const ReviewWorkspace = dynamic(
  () => import("./ReviewWorkspace").then((m) => m.ReviewWorkspace),
  { loading: WorkspaceSkeleton },
);
export const ArtisanProposalDashboard = dynamic(
  () => import("./ArtisanProposalDashboard").then((m) => m.ArtisanProposalDashboard),
  { loading: WorkspaceSkeleton },
);
