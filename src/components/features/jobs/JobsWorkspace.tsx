"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BriefcaseBusiness, FilePlus2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/features/auth";
import { JobsList } from "./components/JobsList";
import { ProposalsList } from "./components/ProposalsList";
import { CreateProposalForm } from "./components/CreateProposalForm";
import { useJobs } from "@/hooks/useJobs";
import { useProposals } from "@/hooks/useProposals";
import { formatCurrency } from "@/lib/formatters";

function TabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-1.5 text-xs ${
            active ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          ({count})
        </span>
      )}
    </button>
  );
}

export default function JobsWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  
  const [activeTab, setActiveTab] = useState<"jobs" | "proposals">("jobs");
  const [search, setSearch] = useState("");
  const [proposalJobId, setProposalJobId] = useState("");

  // Only fetch overall counts for the tabs to keep it lightweight. 
  // We use `limit: 1` just to get the total count metadata from pagination without heavy array fetching.
  const jobsStats = useJobs(
    { clientId: user?.role === "CLIENT" ? user.id : undefined, status: user?.role === "ARTISAN" ? "OPEN" : undefined, limit: 1 },
    { enabled: Boolean(user) }
  );
  const proposalsStats = useProposals(
    { role: user?.role, userId: user?.id, limit: 100 },
    { enabled: Boolean(user) }
  );

  if (!user) return null;

  const isClient = user.role === "CLIENT";
  const isArtisan = user.role === "ARTISAN";

  const totalJobsCount = jobsStats.data?.pagination?.total ?? 0;
  const totalProposalsCount = proposalsStats.data?.pagination?.total ?? 0;
  const pendingProposalsCount = proposalsStats.data?.proposals?.filter((p) => p.status === "PENDING").length ?? 0;

  // Let's use a rough average budget from the single page or default to 0 if not needed for stats.
  const averageBudget = jobsStats.data?.jobs?.length 
    ? jobsStats.data.jobs.reduce((sum, job) => sum + Number(job.budget ?? 0), 0) / jobsStats.data.jobs.length
    : 0;

  return (
    <main className="space-y-6">
      {/* ─── Page Header ─── */}
      <Card className="border-border/80 bg-card/95">
        <CardHeader className="gap-3 md:flex md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-3xl tracking-tight">
              {isClient ? "Your Jobs" : "Find Work"}
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              {isClient
                ? "Manage your posted jobs and review proposals from artisans. Accept a proposal to start the escrow-backed contract process."
                : "Browse available jobs and submit proposals. Once accepted, you'll move into a secure escrow-backed contract."}
            </CardDescription>
          </div>
          {isClient && (
            <Button asChild className="shrink-0">
              <Link href="/jobs/create">
                <FilePlus2 className="size-4" />
                Post a new job
              </Link>
            </Button>
          )}
        </CardHeader>
      </Card>

      {/* ─── Stats Row ─── */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card size="sm">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">
              {isClient ? "Jobs posted" : "Available jobs"}
            </p>
            <p className="text-3xl font-semibold text-foreground">{totalJobsCount}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">
              {isClient ? "Pending proposals" : "Your proposals"}
            </p>
            <p className="text-3xl font-semibold text-foreground">
              {isClient ? pendingProposalsCount : totalProposalsCount}
            </p>
          </CardContent>
        </Card>
        <Card size="sm" className="col-span-2 md:col-span-1">
          <CardContent className="space-y-1 py-2">
            <p className="text-sm text-muted-foreground">Average budget</p>
            <p className="text-3xl font-semibold text-foreground">
              {formatCurrency(averageBudget)}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ─── Tabs ─── */}
      <Card className="border-border/80 bg-card">
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
              <TabButton
                active={activeTab === "jobs"}
                label={isClient ? "My Jobs" : "Available Jobs"}
                count={totalJobsCount}
                onClick={() => setActiveTab("jobs")}
              />
              <TabButton
                active={activeTab === "proposals"}
                label={isClient ? "Proposals" : "My Proposals"}
                count={totalProposalsCount}
                onClick={() => setActiveTab("proposals")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Jobs Tab ─── */}
      {activeTab === "jobs" && (
        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <JobsList
            user={user}
            search={search}
            setSearch={setSearch}
            onApplyToJob={(jobId) => {
              setProposalJobId(jobId);
              setActiveTab("proposals");
            }}
          />

          {/* Guidance panel */}
          <Card className="border-border/80 bg-primary/5 h-fit sticky top-6">
            <CardHeader>
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Sparkles className="size-5 text-primary" />
              </div>
              <CardTitle>
                {isClient ? "What happens next?" : "How to get hired"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              {isClient ? (
                <>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                    <p>Artisans will see your job and submit proposals with their price and plan.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                    <p>Review proposals in the &ldquo;Proposals&rdquo; tab, then accept the best one.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                    <p>Create a contract from the accepted proposal. Funds go into secure escrow.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                    <p>Browse open jobs and click &ldquo;Apply&rdquo; on the ones that match your skills.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                    <p>Submit a clear proposal with a realistic price and delivery timeline.</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                    <p>If accepted, the client funds escrow and you start working with payment guaranteed.</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* ─── Proposals Tab ─── */}
      {activeTab === "proposals" && (
        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          {isArtisan && (
            <CreateProposalForm
              user={user}
              initialJobId={proposalJobId}
              onSuccess={() => setActiveTab("proposals")}
            />
          )}

          <ProposalsList
            user={user}
            onBrowseJobs={() => setActiveTab("jobs")}
          />
        </section>
      )}

      {/* ─── Next Step CTA ─── */}
      <Card className="border-border/80 bg-card">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <BriefcaseBusiness className="size-4 text-primary" />
            <span>
              {isClient
                ? "Accepted proposals become escrow-backed contracts. Manage them in Contracts."
                : "Once your proposal is accepted, the client creates a contract and funds escrow."}
            </span>
          </div>
          <Button asChild variant="outline">
            <Link href="/contracts">
              Go to contracts
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
