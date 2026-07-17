"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateJob } from "@/features/jobs/api/useJobs";
import { CreateJobPayload } from "../../schemas";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { CategorySelector, SkillAutocomplete, SuggestCategoryDialog } from "@/features/taxonomy";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Title & Description" },
  { id: 2, title: "Category & Skills" },
  { id: 3, title: "Budget & Scope" },
];

export function CreateJobWizard() {
  const router = useRouter();
  const createJob = useCreateJob();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateJobPayload>>({
    title: "",
    description: "",
    categoryId: "",
    skillIds: [],
    budget: 0,
    budgetType: "FIXED",
    isRemote: true,
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      // In a real app, validate with zod before submission
      const newJob = await createJob.mutateAsync(formData as any);
      toast.success("Job posted successfully!");
      router.push(`/client/jobs/${newJob.id}`);
    } catch (error) {
      toast.error("Failed to post job");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Progress Tracker */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300" 
          style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors",
              step > s.id ? "bg-primary border-primary text-primary-foreground" :
              step === s.id ? "bg-background border-primary text-primary" :
              "bg-background border-muted text-muted-foreground"
            )}>
              {step > s.id ? <Check className="h-5 w-5" /> : s.id}
            </div>
            <span className={cn(
              "text-xs font-medium",
              step >= s.id ? "text-foreground" : "text-muted-foreground"
            )}>{s.title}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step - 1].title}</CardTitle>
          <CardDescription>Fill in the details for your new job posting.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input 
                    placeholder="e.g. Senior Frontend Developer for E-commerce Site" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Describe the project, requirements, and deliverables..." 
                    className="min-h-[200px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <CategorySelector 
                    value={formData.categoryId}
                    onChange={(id) => setFormData({ ...formData, categoryId: id, skillIds: [] })}
                  />
                  <div className="mt-2">
                    <SuggestCategoryDialog />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Skills</label>
                  <SkillAutocomplete 
                    categoryId={formData.categoryId}
                    selectedIds={formData.skillIds || []}
                    onChange={(ids) => setFormData({ ...formData, skillIds: ids })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Select the taxonomy skills required for this job. You must select a category first.</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget Type</label>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.budgetType}
                      onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as "FIXED" | "HOURLY" })}
                    >
                      <option value="FIXED">Fixed Price</option>
                      <option value="HOURLY">Hourly Rate</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget Amount ($)</label>
                    <Input 
                      type="number" 
                      min="5"
                      value={formData.budget || ""}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Duration</label>
                  <Input 
                    placeholder="e.g. 2-3 months, less than 1 week" 
                    value={formData.expectedDuration || ""}
                    onChange={(e) => setFormData({ ...formData, expectedDuration: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={step === 1 || createJob.isPending}
        >
          Back
        </Button>
        {step < STEPS.length ? (
          <Button onClick={handleNext}>Next Step</Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={createJob.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {createJob.isPending ? "Posting..." : "Post Job"}
          </Button>
        )}
      </div>
    </div>
  );
}
