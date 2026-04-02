"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/app-shell/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useAuth";
import { useCreateJob } from "@/hooks/useJobs";

export default function CreateJobWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const createJobMutation = useCreateJob();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(0);
  const [category, setCategory] = useState("general");
  const [location, setLocation] = useState("");
  const [requirements, setRequirements] = useState("");

  if (!user) {
    return null;
  }

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border-border/80 bg-white">
          <CardHeader className="gap-3">
            <Button asChild variant="ghost" size="sm" className="w-fit">
              <Link href="/jobs">
                <ArrowLeft className="size-4" />
                Back to jobs
              </Link>
            </Button>
            <div className="space-y-1">
              <CardTitle className="text-3xl tracking-tight">Create a Job</CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7">
                Publish a clear brief so artisans can respond with accurate pricing and delivery plans.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Job brief</CardTitle>
              <CardDescription>Keep it specific enough that funding and completion are easy to verify later.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Job title" value={title} onChange={(event) => setTitle(event.target.value)} />
              <Textarea
                placeholder="Detailed scope of work"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  type="number"
                  placeholder="Budget"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value))}
                />
                <Input
                  placeholder="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
              </div>
              <Input
                placeholder="Location or service area"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              <Textarea
                placeholder="Requirements, tools, or special conditions"
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
              />
              <Button
                disabled={!title.trim() || !description.trim() || budget <= 0 || createJobMutation.status === "pending"}
                onClick={() =>
                  createJobMutation.mutate({
                    title,
                    description: [description, location ? `Location: ${location}` : "", requirements]
                      .filter(Boolean)
                      .join("\n\n"),
                    budget,
                    category: category || "general",
                  })
                }
              >
                Publish job
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)]">
            <CardHeader>
              <CardTitle>What makes a good WorkSure job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>Describe deliverables so both parties can confirm completion using the same expectations.</p>
              <p>Set a realistic budget so proposal quality stays high and contract funding is straightforward.</p>
              <p>Use notes and requirements to reduce back-and-forth before you move into escrow.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </AppShell>
  );
}
