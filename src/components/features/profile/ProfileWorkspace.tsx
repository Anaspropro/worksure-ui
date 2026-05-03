"use client";

import { useState } from "react";
import AppShell from "@/components/app-shell/AppShell";
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
import { useVerifyBvn, useKycStatus } from "@/hooks/useKyc";
import { ShieldCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

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
  const [bvn, setBvn] = useState("");

  const verifyBvnMutation = useVerifyBvn();
  const kycStatusQuery = useKycStatus();

  if (!user) {
    return null;
  }

  const handleVerifyBvn = () => {
    if (bvn.length !== 11) {
      toast.error("BVN must be 11 digits");
      return;
    }
    verifyBvnMutation.mutate(bvn, {
      onSuccess: () => {
        toast.success("KYC Verified Successfully!");
        setBvn("");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Verification failed");
      }
    });
  };

  const initialSkills = Array.isArray(artisanProfileQuery.data?.skills)
    ? artisanProfileQuery.data.skills.join(", ")
    : typeof artisanProfileQuery.data?.skills === "string"
      ? artisanProfileQuery.data.skills
      : "";

  return (
    <AppShell user={user}>
      <main className="space-y-6">
        <Card className="border-border/80 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Profile and Trust Signals</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Manage your account identity and, if you are an artisan, the public profile that supports hiring confidence.
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 xl:grid-cols-2">
          <Card className="border-border/80 bg-white">
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
                  <Alert className="border-info/20 bg-info/10 text-info">
                    <Info className="size-4" />
                    <AlertTitle>Action Required</AlertTitle>
                    <AlertDescription>
                      Please provide your Bank Verification Number (BVN) to verify your account.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Select Identification Type</label>
                    <select className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="bvn">Bank Verification Number (BVN)</option>
                      <option value="nin" disabled>National ID Number (NIN) - Coming Soon</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Identification Number</label>
                    <Input 
                      placeholder="Enter 11-digit BVN" 
                      value={bvn}
                      maxLength={11}
                      onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleVerifyBvn}
                    disabled={verifyBvnMutation.status === "pending" || bvn.length !== 11}
                  >
                    {verifyBvnMutation.status === "pending" ? "Verifying..." : "Verify Identity"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {user.role === "ARTISAN" ? (
            <Card className="border-border/80 bg-white">
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
    </AppShell>
  );
}
