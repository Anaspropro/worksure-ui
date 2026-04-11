import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArtisanWorkspaceSection({
  jobs,
  proposalJobId,
  proposalAmountInput,
  proposalMessage,
  setProposalJobId,
  setProposalAmountInput,
  setProposalMessage,
  onSubmitProposal,
  isBusy,
  formatAmount,
  artisanVerified,
}: {
  jobs: Array<{ id: string; title: string; budget: number }> | undefined;
  proposalJobId: string;
  proposalAmountInput: string;
  proposalMessage: string;
  setProposalJobId: (value: string) => void;
  setProposalAmountInput: (value: string) => void;
  setProposalMessage: (value: string) => void;
  onSubmitProposal: () => void;
  isBusy: boolean;
  formatAmount: (value: number) => string;
  artisanVerified: boolean;
}) {
  const proposalAmount = Number(proposalAmountInput || 0);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/90 bg-white">
        <CardHeader>
          <CardTitle>Submit a proposal</CardTitle>
          <CardDescription>
            Respond to an open job with your amount and delivery approach.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!artisanVerified ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Artisan verification is required before you can submit proposals.
            </div>
          ) : null}
          <select
            className="h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={proposalJobId}
            onChange={(event) => setProposalJobId(event.target.value)}
          >
            <option value="">Select a job</option>
            {jobs?.map((job) => (
              <option value={job.id} key={job.id}>
                {job.title} ({formatAmount(job.budget)})
              </option>
            ))}
          </select>
          <Input type="number" placeholder="Proposal amount" value={proposalAmountInput} onChange={(event) => setProposalAmountInput(event.target.value)} />
          <Textarea placeholder="Proposal message" value={proposalMessage} onChange={(event) => setProposalMessage(event.target.value)} />
          <Button onClick={onSubmitProposal} disabled={!artisanVerified || isBusy || !proposalJobId || proposalAmount <= 0 || !proposalMessage.trim()}>
            Submit proposal
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_100%)]">
        <CardHeader>
          <CardTitle>Artisan trust signals</CardTitle>
          <CardDescription>
            Use funded contracts and visible status changes to reduce uncertainty about payout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-text-secondary">
          <p>Bid on active work with a clear scope and amount.</p>
          <p>Track accepted proposals as contracts with visible escrow status.</p>
          <p>Confirm delivery once the funded work is complete.</p>
        </CardContent>
      </Card>
    </section>
  );
}
