"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useAuth";
import { useKyc, useSaveKyc } from "@/hooks/useKyc";

export default function KycSubmitWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const kycQuery = useKyc(user?.role === "ARTISAN");
  const saveKycMutation = useSaveKyc(Boolean(kycQuery.data));

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");

  if (!user) {
    return null;
  }

  const initialSkills = Array.isArray(kycQuery.data?.skills)
    ? kycQuery.data.skills.join(", ")
    : typeof kycQuery.data?.skills === "string"
      ? kycQuery.data.skills
      : "";

  return (
    <main className="space-y-6">
      <Card className="border-border/80 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Verification Submission</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            WorkSure currently uses artisan profile completeness as the verification intake used by admins for review.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle>Verification details</CardTitle>
            <CardDescription>Share the information admins need to assess service readiness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={bio || kycQuery.data?.bio || ""}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Professional bio"
            />
            <Input
              value={skills || initialSkills}
              onChange={(event) => setSkills(event.target.value)}
              placeholder="Skills (comma separated)"
            />
            <Textarea
              value={experience || kycQuery.data?.experience || ""}
              onChange={(event) => setExperience(event.target.value)}
              placeholder="Experience"
            />
            <Textarea
              value={portfolio}
              onChange={(event) => setPortfolio(event.target.value)}
              placeholder="Portfolio links, one per line"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={saveKycMutation.status === "pending"}
                onClick={() =>
                  saveKycMutation.mutate({
                    bio: bio || kycQuery.data?.bio || "",
                    skills: (skills || initialSkills)
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                    experience: experience || kycQuery.data?.experience || "",
                    portfolio: portfolio
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
              >
                Save verification details
              </Button>
              <Button asChild variant="outline">
                <Link href="/kyc/status">View status</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-primary-soft/20">
          <CardHeader>
            <CardTitle>What admins review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Clear skills that match the type of work you want to bid on.</p>
            <p>Enough experience detail to understand delivery quality and reliability.</p>
            <p>Optional portfolio links that support trust before a client funds escrow.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
