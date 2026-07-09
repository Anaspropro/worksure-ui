import { Job } from "../types";
import { JobStatusBadge } from "./JobStatusBadge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Clock, MapPin, Users, DollarSign, Briefcase } from "lucide-react";
import { CategoryBadge, SkillBadge } from "@/features/taxonomy";

interface JobHeaderProps {
  job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <JobStatusBadge status={job.status} />
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {job.category && (
                <div className="flex items-center gap-2">
                  <CategoryBadge category={job.category} />
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {job.isRemote ? "Remote" : job.location || "Location TBD"}
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {job.expectedDuration || "Duration TBD"}
              </div>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {job.budget.toLocaleString()} {job.budgetType === "HOURLY" ? "/ hr" : "Fixed Price"}
              </div>
            </div>
            
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {job.skills.map(skill => (
                  <SkillBadge key={skill.id} skill={skill} />
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2 bg-muted/30 p-4 rounded-lg md:min-w-[200px]">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Proposals
            </span>
            <span className="text-3xl font-semibold">{job.proposalsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
