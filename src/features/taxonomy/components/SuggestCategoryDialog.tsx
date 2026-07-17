"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { suggestCategory } from "../services/taxonomy-service";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

export function SuggestCategoryDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      await suggestCategory({ name: name.trim(), description: description.trim() || undefined });
      toast.success("Category suggestion submitted!", {
        description: "An admin will review it shortly. Thanks for helping us improve!"
      });
      setOpen(false);
      setName("");
      setDescription("");
    } catch (error: any) {
      toast.error("Failed to submit suggestion", {
        description: error.message || "An unexpected error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="w-full justify-start text-muted-foreground mt-2 border-dashed">
            <PlusCircle className="mr-2 h-4 w-4" />
            Can't find your category? Suggest one
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suggest a New Category</DialogTitle>
          <DialogDescription>
            Help us expand our marketplace by suggesting a new category for jobs and services.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Category Name <span className="text-destructive">*</span></label>
            <Input 
              id="name" 
              placeholder="e.g. Drone Repair" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
            <Textarea 
              id="description" 
              placeholder="Briefly describe what kind of jobs fall under this category." 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
