"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/features/auth";
import {
  useArtisanProfile,
  useProfile,
  useSaveArtisanProfile,
  useUpdateProfile,
} from "@/features/profile/api/useProfile";
import { useReviewStats } from "@/features/reviews/api/useReviews";
import { useKycStatus } from "@/features/kyc/api/useKyc";
import { ShieldCheck, Info, User as UserIcon, Briefcase, Star, CheckCircle2 } from "lucide-react";
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
    <main 
      className="space-y-6"
    >
      <div>
        <Card className="border-border bg-card shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <UserIcon className="size-40" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl tracking-tight text-foreground">Profile and Trust Signals</CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Manage your account identity and public profile that supports hiring confidence.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div>
          <Card className="border-border bg-card shadow-sm h-full flex flex-col transition-colors hover:border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="size-5 text-primary" />
                Account Details
              </CardTitle>
              <CardDescription>Keep your contact and trust details current for contracts and support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <Input
                    value={name ?? profileQuery.data?.name ?? ""}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter full name"
                    className="bg-background/50 border-border/50 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <Input 
                    value={profileQuery.data?.email ?? ""} 
                    readOnly 
                    className="bg-muted/30 text-muted-foreground border-border/30 cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</label>
                  <Input
                    value={phone ?? profileQuery.data?.phone ?? ""}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter phone number"
                    className="bg-background/50 border-border/50 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</label>
                  <Textarea
                    value={address ?? profileQuery.data?.address ?? ""}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Enter your address"
                    className="bg-background/50 border-border/50 focus-visible:ring-primary/20 resize-none min-h-[80px]"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    {user.role}
                  </Badge>
                  {user.role === "ARTISAN" ? (
                    <Badge variant={user.artisanVerified ? "default" : "outline"} className={user.artisanVerified ? "bg-success hover:bg-success/90" : "border-warning/50 text-warning"}>
                      {user.artisanVerified ? "Verified Artisan" : "Verification Pending"}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <Button
                disabled={updateProfileMutation.status === "pending"}
                className="w-full mt-4 shadow-sm group"
                onClick={() =>
                  updateProfileMutation.mutate({
                    name: name ?? profileQuery.data?.name ?? "",
                    phone: phone ?? profileQuery.data?.phone ?? "",
                    address: address ?? profileQuery.data?.address ?? "",
                  })
                }
              >
                Save Account Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 flex flex-col">
          <div>
            <Card className="border-border bg-card shadow-sm relative overflow-hidden transition-colors hover:border-primary/20">
              <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  Identity Verification (KYC)
                </CardTitle>
                <CardDescription>
                  Verify your identity to enable payments, withdrawals, and higher trust scores.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                
                  {kycStatusQuery.data?.kycVerified ? (
                    <div
                      key="verified"
                    >
                      <Alert className="border-success/30 bg-success/10 text-success-foreground relative overflow-hidden">
                        <div className="absolute inset-0 bg-success/5 animate-pulse" />
                        <CheckCircle2 className="size-5 text-success relative z-10" />
                        <AlertTitle className="relative z-10 font-semibold text-success flex items-center gap-2">
                          Identity Verified
                        </AlertTitle>
                        <AlertDescription className="relative z-10 text-success/90 mt-1">
                          Your identity has been successfully verified via Paystack. You have full access to platform features.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div
                      key="pending"
                      className="space-y-4"
                    >
                      <Alert className="border-warning/30 bg-warning/5 text-warning-foreground">
                        <Info className="size-5 text-warning" />
                        <AlertTitle className="text-warning font-semibold">Verification Pending</AlertTitle>
                        <AlertDescription className="text-warning/90 mt-1">
                          Your account needs to be verified before you can start bidding on jobs or receiving payments.
                        </AlertDescription>
                      </Alert>

                      <Button
                        className="w-full shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => window.location.href = "/kyc/submit"}
                      >
                        Start KYC Verification
                      </Button>
                    </div>
                  )}
                
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 flex flex-col">
            {user.role === "ARTISAN" ? (
              <Card className="border-border bg-card shadow-sm flex-1 flex flex-col transition-colors hover:border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="size-5 text-primary" />
                    Marketplace Profile
                  </CardTitle>
                  <CardDescription>This profile powers your discoverability, verification readiness, and reviews.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Professional Bio</label>
                      <Textarea
                        value={bio ?? artisanProfileQuery.data?.bio ?? ""}
                        onChange={(event) => setBio(event.target.value)}
                        placeholder="Tell clients about yourself..."
                        className="bg-background/50 border-border/50 focus-visible:ring-primary/20 min-h-[100px] resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Skills (Comma Separated)</label>
                      <Input
                        value={skills ?? initialSkills}
                        onChange={(event) => setSkills(event.target.value)}
                        placeholder="e.g. Plumbing, Carpentry, Electrical"
                        className="bg-background/50 border-border/50 focus-visible:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience</label>
                      <Textarea
                        value={experience ?? artisanProfileQuery.data?.experience ?? ""}
                        onChange={(event) => setExperience(event.target.value)}
                        placeholder="Detail your past experience..."
                        className="bg-background/50 border-border/50 focus-visible:ring-primary/20 min-h-[80px] resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="rounded-xl border border-border/50 bg-background/40 p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-foreground">
                          {reviewStatsQuery.data?.totalReviews ?? 0}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Total Reviews</span>
                      </div>
                      <div className="rounded-xl border border-border/50 bg-background/40 p-4 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-1.5 text-2xl font-bold text-foreground">
                          {reviewStatsQuery.data?.averageRating?.toFixed(1) ?? "0.0"}
                          <Star className="size-5 text-amber-500 fill-amber-500" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Avg Rating</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    disabled={saveArtisanProfileMutation.status === "pending"}
                    className="w-full mt-4 shadow-sm"
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
                    Save Marketplace Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border bg-card shadow-sm flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="size-5 text-primary" />
                    Client Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <p className="text-foreground font-medium mb-1">Your Reputation Matters</p>
                    <p>Client profiles stay lightweight, but they still anchor contracts, funding, and reviews. Your completed contracts and ratings will become stronger trust signals over time.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
