import { Proposal } from "../types";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { getInitials } from "@/shared/lib/utils";
import { DollarSign, Clock } from "lucide-react";

interface ProposalCardProps {
  proposal: Proposal;
  onClick?: () => void;
}

export function ProposalCard({ proposal, onClick }: ProposalCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row justify-between items-start pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(proposal.artisan.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">{proposal.artisan.name}</h3>
            <span className="text-xs text-muted-foreground">
              Submitted {new Date(proposal.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Badge variant={proposal.status === "SUBMITTED" ? "outline" : proposal.status === "ACCEPTED" ? "default" : "secondary"}>
          {proposal.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6 mb-4 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            ${proposal.amount.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {proposal.estimatedDuration || 'Not specified'}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {proposal.message}
        </p>
      </CardContent>
    </Card>
  );
}
