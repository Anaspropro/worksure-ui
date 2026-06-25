"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useAuth";
import {
  useArtisanProfile,
  useProfile,
  useSaveArtisanProfile,
  useUpdateProfile,
} from "@/hooks/useProfile";
import { useReviewStats } from "@/hooks/useReviews";
import { useKycStatus } from "@/hooks/useKyc";
import { ShieldCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function ProfileWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  const canLoadProtectedData = Boolean(user);
  const profileQuery = useProfile({ enabled: canLoadProtectedData });
  const artisanProfileQuery = useArtisanProfile(user?.role === "ARTISAN");
  const reviewStatsQuery = useReviewStats(user?.role === "ARTISAN" ? user.id : undefined);
  const updateProfileMutation = useUpdateProfile();
  const saveArtisanProfileMutation = useSaveArtisanProfile(Boolean(artisanProfileQuery.data));

  const [name, setName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [skills, setSkills] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const kycStatusQuery = useKycStatus();

  if (!user) return null;

  const initialSkills = Array.isArray(artisanProfileQuery.data?.skills)
    ? artisanProfileQuery.data.skills.join(", ")
    : typeof artisanProfileQuery.data?.skills === "string"
      ? artisanProfileQuery.data.skills
      : "";

  return (
    <main className="space-y-6">
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Profile and Trust Signals</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7">
            Manage your account identity and, if you are an artisan, the public profile that supports hiring confidence.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/80 bg-card">
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <CardDescription>Keep your contact and trust details current for contracts and support.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={name ?? profileQuery.data?.name ?? ""}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
            />
            <Input value={profileQuery.data?.email ?? ""} readOnly placeholder="Email address" />
            <Input
              value={phone ?? profileQuery.data?.phone ?? ""}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number"
            />
            <Textarea
              value={address ?? profileQuery.data?.address ?? ""}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Address"
            />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{user.role}</Badge>
              {user.role === "ARTISAN" ? (
                <Badge>{user.artisanVerified ? "Verified artisan" : "Verification pending"}</Badge>
              ) : null}
            </div>
            <Button
              disabled={updateProfileMutation.status === "pending"}
              onClick={() =>
                updateProfileMutation.mutate({
                  name: name ?? profileQuery.data?.name ?? "",
                  phone: phone ?? profileQuery.data?.phone ?? "",
                  address: address ?? profileQuery.data?.address ?? "",
                })
              }
            >
              Save account profile
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-6 text-primary" />
              Identity Verification (KYC)
            </CardTitle>
            <CardDescription>
              Verify your identity to enable payments, withdrawals, and higher trust scores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {kycStatusQuery.data?.kycVerified ? (
              <Alert className="border-success/20 bg-success/10 text-success">
                <ShieldCheck className="size-4" />
                <AlertTitle>Verified</AlertTitle>
                <AlertDescription>
                  Your identity has been successfully verified via Paystack.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert className="border-warning/20 bg-warning/10 text-warning">
                  <Info className="size-4" />
                  <AlertTitle>Verification Pending</AlertTitle>
                  <AlertDescription>
                    Your account needs to be verified before you can start bidding on jobs.
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full"
                  onClick={() => window.location.href = "/kyc/submit"}
                >
                  Start KYC Verification
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {user.role === "ARTISAN" ? (
          <Card className="border-border/80 bg-card">
            <CardHeader>
              <CardTitle>Artisan marketplace profile</CardTitle>
              <CardDescription>This profile powers your discoverability, verification readiness, and reviews.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={bio ?? artisanProfileQuery.data?.bio ?? ""}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Professional bio"
              />
              <Input
                value={skills ?? initialSkills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Skills (comma separated)"
              />
              <Textarea
                value={experience ?? artisanProfileQuery.data?.experience ?? ""}
                onChange={(event) => setExperience(event.target.value)}
                placeholder="Experience"
              />
              <div className="rounded-lg border border-border bg-surface-muted/60 p-4 text-sm text-muted-foreground">
                <p>Total reviews: {reviewStatsQuery.data?.totalReviews ?? 0}</p>
                <p>Average rating: {reviewStatsQuery.data?.averageRating ?? 0}</p>
              </div>
              <Button
                disabled={saveArtisanProfileMutation.status === "pending"}
                onClick={() =>
                  saveArtisanProfileMutation.mutate({
                    bio: bio ?? artisanProfileQuery.data?.bio ?? "",
                    skills: (skills ?? initialSkills)
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                    experience: experience ?? artisanProfileQuery.data?.experience ?? "",
                  })
                }
              >
                Save artisan profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/80 bg-secondary-light/20">
            <CardHeader>
              <CardTitle>Client identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>Client profiles stay lightweight, but they still anchor contracts, funding, and reviews.</p>
              <p>Your completed contracts and ratings will become stronger trust signals over time.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
