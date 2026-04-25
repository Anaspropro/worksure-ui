"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, ShieldCheck, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FinancialAmount } from "@/components/ui/financial-amount";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

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
  const cards = [
    {
      label: "Active Jobs",
      value: <span className="text-3xl font-bold">{jobsCount}</span>,
      icon: BriefcaseBusiness,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: emphasisLabel,
      value: <FinancialAmount amount={emphasisValue} size="3xl" />,
      icon: ShieldCheck,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      label: "Ready to release",
      value: <span className="text-3xl font-bold">{readyToRelease}</span>,
      icon: Wallet,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <Card className="border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="px-5 py-5 flex flex-col justify-between h-full relative">
              <div>
                <p className="text-sm font-medium text-foreground">{card.label}</p>
                <div className="mt-2">{card.value}</div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-primary hover:text-primary-700 cursor-pointer transition-colors">View all</span>
              </div>
              <div className={`absolute right-5 bottom-5 rounded-xl ${card.iconBg} p-3`}>
                 <card.icon className={`size-6 ${card.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
