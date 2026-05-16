"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, FileUp, Loader2, ShieldCheck, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useAuth";
import { useKyc, useSaveKyc, useVerifyIdentity, useUploadKycDocument, useKycStatus } from "@/hooks/useKyc";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "058", name: "Guaranty Trust Bank (GTB)" },
  { code: "033", name: "United Bank for Africa (UBA)" },
  { code: "032", name: "Union Bank" },
  { code: "057", name: "Zenith Bank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "214", name: "First City Monument Bank (FCMB)" },
  { code: "030", name: "Heritage Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
];

export default function KycSubmitWorkspace() {
  const userQuery = useUser();
  const user = userQuery.data;
  
  const kycStatusQuery = useKycStatus();
  const kycStatus = kycStatusQuery.data?.kycStatus || "UNVERIFIED";

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Step 1: Identity State
  const [bvn, setBvn] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const verifyIdentityMutation = useVerifyIdentity();

  // Step 2: Document State
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [proofOfAddressFile, setProofOfAddressFile] = useState<File | null>(null);
  const uploadDocMutation = useUploadKycDocument();

  // Step 3: Professional Details State
  const kycQuery = useKyc(user?.role === "ARTISAN");
  const saveKycMutation = useSaveKyc(Boolean(kycQuery.data));
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const initialSkills = Array.isArray(kycQuery.data?.skills)
    ? kycQuery.data.skills.join(", ")
    : typeof kycQuery.data?.skills === "string"
      ? kycQuery.data.skills
      : "";

  if (!user) return null;

  const handleVerifyIdentity = async () => {
    if (!bvn || !bankCode || !accountNumber) {
      toast.error("Please fill in all identity fields");
      return;
    }
    
    try {
      await verifyIdentityMutation.mutateAsync({ bvn, bankCode, accountNumber });
      toast.success("Identity verified successfully!");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to verify identity");
    }
  };

  const handleUploadDocuments = async () => {
    if (!idCardFile) {
      toast.error("Valid ID card is required");
      return;
    }

    try {
      // Upload ID Card
      await uploadDocMutation.mutateAsync({ file: idCardFile, documentType: "GOVERNMENT_ID" });
      
      // Upload Proof of Address if provided
      if (proofOfAddressFile) {
        await uploadDocMutation.mutateAsync({ file: proofOfAddressFile, documentType: "PROOF_OF_ADDRESS" });
      }

      toast.success("Documents uploaded successfully!");
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload documents");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await saveKycMutation.mutateAsync({
        bio: bio || kycQuery.data?.bio || "",
        skills: (skills || initialSkills).split(",").map((item) => item.trim()).filter(Boolean),
        experience: experience || kycQuery.data?.experience || "",
        portfolio: portfolio.split("\n").map((item) => item.trim()).filter(Boolean),
      });
      toast.success("Verification application submitted successfully!");
      // Redirect or show success state
      window.location.href = "/kyc/status";
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile details");
    }
  };

  return (
    <main className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="size-8 text-primary" />
          KYC Verification
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Complete your identity verification and professional profile to start bidding on jobs.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
        
        <div className="relative z-10 flex justify-between">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`flex items-center justify-center size-10 rounded-full border-4 font-bold transition-colors ${
                step >= s ? "bg-primary border-primary/20 text-primary-foreground" : "bg-card border-muted text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="size-5" /> : s}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>1. Identity Verification</CardTitle>
                <CardDescription>We use Paystack BVN match to securely verify your identity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Virtual Number (BVN)</label>
                  <Input 
                    placeholder="Enter your 11-digit BVN" 
                    value={bvn} 
                    onChange={(e) => setBvn(e.target.value)} 
                    maxLength={11}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <Select value={bankCode} onValueChange={setBankCode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_BANKS.map((bank) => (
                        <SelectItem key={bank.code} value={bank.code}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input 
                    placeholder="Enter your 10-digit account number" 
                    value={accountNumber} 
                    onChange={(e) => setAccountNumber(e.target.value)} 
                    maxLength={10}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-border/50 pt-6">
                <Button onClick={handleVerifyIdentity} disabled={verifyIdentityMutation.isPending}>
                  {verifyIdentityMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Verify & Continue <ChevronRight className="ml-2 size-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>2. Document Upload</CardTitle>
                <CardDescription>Upload supporting documents for manual review by our admins.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* ID Card */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Valid ID Card (Voter's Card, NIN) <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Required</Badge>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*,.pdf"
                      onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                    />
                    <FileUp className="size-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground">
                      {idCardFile ? idCardFile.name : "Click to browse or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF (Max 10MB)</p>
                  </div>
                </div>

                {/* Proof of Address */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Proof of Address <Badge variant="secondary" className="border-0">Optional</Badge>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*,.pdf"
                      onChange={(e) => setProofOfAddressFile(e.target.files?.[0] || null)}
                    />
                    <FileUp className="size-6 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      {proofOfAddressFile ? proofOfAddressFile.name : "Utility bill or bank statement"}
                    </p>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleUploadDocuments} disabled={uploadDocMutation.isPending || !idCardFile}>
                  {uploadDocMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Upload & Continue <ChevronRight className="ml-2 size-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>3. Professional Profile</CardTitle>
                <CardDescription>Share your experience to help admins and clients assess your service readiness.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Professional Bio</label>
                  <Textarea
                    value={bio || kycQuery.data?.bio || ""}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skills</label>
                  <Input
                    value={skills || initialSkills}
                    onChange={(event) => setSkills(event.target.value)}
                    placeholder="e.g. Plumbing, Carpentry, Electrical (comma separated)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience</label>
                  <Textarea
                    value={experience || kycQuery.data?.experience || ""}
                    onChange={(event) => setExperience(event.target.value)}
                    placeholder="Describe your past work experience..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Portfolio Links</label>
                  <Textarea
                    value={portfolio}
                    onChange={(event) => setPortfolio(event.target.value)}
                    placeholder="https://example.com/project1&#10;https://example.com/project2"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-6">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handleSaveProfile} disabled={saveKycMutation.isPending}>
                  {saveKycMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Submit Application
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
