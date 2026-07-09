import { Badge } from "@/shared/components/ui/badge";
import { Flame, CheckCircle2 } from "lucide-react";
import { Skill } from "../types";

interface SkillBadgeProps {
  skill: Skill;
  className?: string;
}

export function SkillBadge({ skill, className }: SkillBadgeProps) {
  return (
    <Badge variant="outline" className={className}>
      {skill.name}
      {skill.isVerified && <CheckCircle2 className="ml-1 h-3 w-3 text-blue-500" />}
      {skill.isTrending && <Flame className="ml-1 h-3 w-3 text-orange-500" />}
    </Badge>
  );
}
