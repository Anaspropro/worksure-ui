"use client";

import { motion } from "framer-motion";
import { ShieldAlert, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function AdminWorkspaceSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Platform activity snapshot</CardTitle>
            <CardDescription>
              Admin-specific moderation, KYC, and dispute tools still need dedicated screens, but
              the design language already makes trust states visible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-text-secondary">
            <p>Dedicated review flows can reuse the same status colors for verification and disputes.</p>
            <div className="pt-4">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/admin/contracts">
                  <FileText className="size-4" />
                  View all system contracts
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
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
      </motion.div>
    </section>
  );
}
