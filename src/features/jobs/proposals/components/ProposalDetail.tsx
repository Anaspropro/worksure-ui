import { Proposal } from "../types";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { getInitials } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { DollarSign, Clock, Calendar, Paperclip } from "lucide-react";

interface ProposalDetailProps {
  proposal: Proposal;
}

export function ProposalDetail({ proposal }: ProposalDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">{getInitials(proposal.artisanName)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{proposal.artisanName}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              Submitted {new Date(proposal.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <Badge className="w-fit text-sm py-1 px-3" variant={proposal.status === "PENDING" ? "outline" : proposal.status === "ACCEPTED" ? "default" : "secondary"}>
          {proposal.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" /> Bid Amount
            </div>
            <div className="text-xl font-semibold">${proposal.bidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Duration
            </div>
            <div className="text-xl font-semibold">{proposal.estimatedDuration}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
        <div className="bg-muted/30 p-6 rounded-lg text-sm leading-relaxed whitespace-pre-wrap border">
          {proposal.coverLetter}
        </div>
      </div>
      
      {proposal.attachments && proposal.attachments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Attachments</h3>
          <div className="flex flex-col gap-2">
            {proposal.attachments.map(att => (
              <div key={att.id} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                <Paperclip className="h-4 w-4" />
                {att.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
