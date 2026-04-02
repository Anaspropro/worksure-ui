import { BriefcaseBusiness, ShieldCheck, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardStats({
  jobsCount,
  emphasisLabel,
  emphasisValue,
  readyToRelease,
}: {
  jobsCount: number;
  emphasisLabel: string;
  emphasisValue: number;
  readyToRelease: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3 mt-4">
      <Card className="border-emerald-200/80 bg-[linear-gradient(180deg,#def7ea_0%,#f5fff8_100%)]">
        <CardContent className="px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-text-secondary">Open jobs</p>
              <p className="mt-2 text-3xl font-semibold text-secondary">{jobsCount}</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3">
              <BriefcaseBusiness className="size-5 text-primary-dark" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-emerald-200/80 bg-[linear-gradient(180deg,#def7ea_0%,#f5fff8_100%)]">
        <CardContent className="px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-text-secondary">{emphasisLabel}</p>
              <p className="mt-2 text-3xl font-semibold text-primary-dark">{emphasisValue}</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3">
              <ShieldCheck className="size-5 text-primary-dark" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-emerald-200/80 bg-[linear-gradient(180deg,#def7ea_0%,#f5fff8_100%)]">
        <CardContent className="px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-text-secondary">Ready to release</p>
              <p className="mt-2 text-3xl font-semibold text-success">{readyToRelease}</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3">
              <Wallet className="size-5 text-primary-dark" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
