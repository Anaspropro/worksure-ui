import dynamic from "next/dynamic";
import React from "react";

const WorkspaceSkeleton = () =>
  React.createElement(
    "div",
    { className: "p-6 space-y-4 animate-pulse" },
    React.createElement("div", { className: "h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded" }),
    React.createElement("div", { className: "h-48 w-full bg-slate-200 dark:bg-slate-700 rounded" }),
    React.createElement("div", { className: "h-48 w-full bg-slate-200 dark:bg-slate-700 rounded" }),
  );

// Client
export const ClientJobsWorkspace = dynamic(
  () => import("./client/ClientJobsWorkspace").then((m) => m.ClientJobsWorkspace),
  { loading: WorkspaceSkeleton },
);
export const ClientJobDetail = dynamic(
  () => import("./client/ClientJobDetail").then((m) => m.ClientJobDetail),
  { loading: WorkspaceSkeleton },
);
export const CreateJobWizard = dynamic(
  () => import("./client/CreateJobWizard").then((m) => m.CreateJobWizard),
  { loading: WorkspaceSkeleton },
);

// Artisan
export const MarketplaceWorkspace = dynamic(
  () => import("./artisan/MarketplaceWorkspace").then((m) => m.MarketplaceWorkspace),
  { loading: WorkspaceSkeleton },
);
export const ArtisanJobDetail = dynamic(
  () => import("./artisan/ArtisanJobDetail").then((m) => m.ArtisanJobDetail),
  { loading: WorkspaceSkeleton },
);
export const SavedJobsList = dynamic(
  () => import("./artisan/SavedJobsList").then((m) => m.SavedJobsList),
  { loading: WorkspaceSkeleton },
);

// Admin
export const AdminJobsWorkspace = dynamic(
  () => import("./admin/AdminJobsWorkspace").then((m) => m.AdminJobsWorkspace),
  { loading: WorkspaceSkeleton },
);
export const AdminJobDetail = dynamic(
  () => import("./admin/AdminJobDetail").then((m) => m.AdminJobDetail),
  { loading: WorkspaceSkeleton },
);
