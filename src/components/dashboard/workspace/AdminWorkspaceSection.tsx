import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminWorkspaceSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border/90 bg-white lg:col-span-2">
        <CardHeader>
          <CardTitle>Platform activity snapshot</CardTitle>
          <CardDescription>
            Admin-specific moderation, KYC, and dispute tools still need dedicated screens, but
            the design language already makes trust states visible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-text-secondary">
          <p>Jobs, proposals, and contracts here reflect the live contract path in the marketplace.</p>
          <p>Dedicated review flows can reuse the same status colors for verification and disputes.</p>
        </CardContent>
      </Card>
      <Card className="border-border bg-danger/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-danger" />
            Admin focus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-text-secondary">
          <p>Trust and safety review</p>
          <p>KYC verification queue</p>
          <p>Dispute response workflow</p>
        </CardContent>
      </Card>
    </section>
  );
}
