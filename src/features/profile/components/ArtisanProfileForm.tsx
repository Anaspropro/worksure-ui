"use client";

import { useState } from "react";
import { SkillAutocomplete, CategorySelector } from "@/features/taxonomy";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";

export function ArtisanProfileForm() {
  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    hourlyRate: "",
    categoryId: "",
    skillIds: [] as string[],
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Mock save
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.success("Profile updated successfully!");
    setIsSaving(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Professional Profile</CardTitle>
        <CardDescription>
          Update your profile to stand out to clients. Your category and skills determine which jobs you match with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional Title</label>
                <Input 
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hourly Rate ($)</label>
                <Input 
                  type="number"
                  min="5"
                  placeholder="e.g. 45"
                  value={formData.hourlyRate}
                  onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 border-t pt-4 mt-4">
              <h3 className="text-base font-semibold">Taxonomy Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select your primary category and relevant skills. This information is shared with the Job matching system.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Category</label>
                  <CategorySelector 
                    value={formData.categoryId}
                    onChange={(id) => setFormData({ ...formData, categoryId: id, skillIds: [] })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expertise & Skills</label>
                  <SkillAutocomplete 
                    categoryId={formData.categoryId}
                    selectedIds={formData.skillIds}
                    onChange={(ids) => setFormData({ ...formData, skillIds: ids })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4 mt-4">
              <label className="text-sm font-medium">Bio</label>
              <Textarea 
                placeholder="Tell clients about your experience and expertise..."
                className="min-h-[150px]"
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="bg-primary">
              {isSaving ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
