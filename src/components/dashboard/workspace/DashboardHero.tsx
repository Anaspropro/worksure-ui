import { CheckCircle2, CircleDashed, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { workflowSteps } from "@/components/dashboard/workspace/dashboard-copy";

function WorkflowIcon({ icon }: { icon: (typeof workflowSteps)[number]["icon"] }) {
  if (icon === "wallet") return <Wallet className="size-4 text-primary-dark" />;
  if (icon === "progress") return <CircleDashed className="size-4 text-primary-dark" />;
  return <CheckCircle2 className="size-4 text-success" />;
}

export default function DashboardHero({
  roleView,
  title,
  description,
}: {
  roleView: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-emerald-200/80 bg-primary/10 shadow-[0_22px_50px_-34px_rgba(16,185,129,0.3)]">
      <CardHeader className="space-y-4">
        <Badge variant="outline" className="w-fit rounded-full border-emerald-200 bg-white/80 px-3 py-1 text-primary-dark">
          {roleView.toLowerCase()} dashboard
        </Badge>
        <div className="space-y-2">
          <CardTitle className="text-3xl tracking-tight text-slate-950 sm:text-4xl">{title}</CardTitle>
          <CardDescription className="max-w-2xl text-base leading-7 text-slate-700">
            {description}
          </CardDescription>
        </div>
        <div className="grid gap-3 rounded-2xl bg-white/45 p-4 grid-cols-2 md:grid-cols-4">
          {workflowSteps.map(({ label, icon }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 ring-1 ring-emerald-100 shadow-[0_16px_36px_-30px_rgba(16,185,129,0.25)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft">
                <WorkflowIcon icon={icon} />
              </div>
              <p className="text-sm font-medium text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}
