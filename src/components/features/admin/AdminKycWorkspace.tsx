"use client";

import { useState, useMemo } from "react";
import { 
  UserCheck, 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  ShieldCheck,
  MoreVertical,
  ExternalLink,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdminUsers, useVerifyArtisan } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { ease: "easeOut" as const } }
};

export default function AdminKycWorkspace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "VERIFIED">("PENDING");

  const { data: usersData, isLoading } = useAdminUsers();
  const verifyMutation = useVerifyArtisan();

  const artisans = useMemo(() => {
    return usersData?.data.filter(u => u.role === "ARTISAN") || [];
  }, [usersData]);
  
  const filteredArtisans = useMemo(() => {
    return artisans.filter(a => {
      const matchesSearch = 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filter === "ALL" || 
        (filter === "PENDING" && !a.artisanVerified) ||
        (filter === "VERIFIED" && a.artisanVerified);
        
      return matchesSearch && matchesFilter;
    });
  }, [artisans, searchTerm, filter]);

  const handleVerify = async (userId: string) => {
    const toastId = toast.loading("Verifying artisan...");
    try {
      await verifyMutation.mutateAsync(userId);
      toast.success("Artisan verified successfully", { id: toastId });
    } catch (err) {
      toast.error("Failed to verify artisan", { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary backdrop-blur-md">
                Identity & Trust
              </Badge>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Artisan KYC Verification</h1>
                <CardDescription className="max-w-2xl text-base text-muted-foreground leading-relaxed">
                  Review documents and verify the identity of artisans to maintain platform integrity.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/20 text-primary">
                <UserCheck className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{artisans.filter(a => !a.artisanVerified).length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Toolbar ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <div className="flex gap-2 w-full sm:w-auto">
            {["PENDING", "VERIFIED", "ALL"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(f as any)}
                className="rounded-full px-6"
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-10 rounded-full bg-muted/50 border-none ring-1 ring-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredArtisans.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-24 text-center border-dashed">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <User className="size-8 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium text-foreground">No artisans found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredArtisans.map((artisan) => (
              <motion.div key={artisan.id} variants={itemVariants}>
                <Card className="group relative overflow-hidden border-border/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-muted to-muted/80 flex items-center justify-center text-muted-foreground font-bold text-xl border border-border/50">
                        {artisan.name.charAt(0)}
                      </div>
                      <Badge variant={artisan.artisanVerified ? "default" : "secondary"} className="rounded-full">
                        {artisan.artisanVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">
                        {artisan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        {artisan.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Joined</p>
                        <p className="text-xs font-semibold flex items-center gap-1.5">
                          <Calendar className="size-3" />
                          {format(new Date(artisan.createdAt), "MMM yyyy")}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Phone</p>
                        <p className="text-xs font-semibold flex items-center gap-1.5">
                          <Phone className="size-3" />
                          {artisan.phone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {!artisan.artisanVerified ? (
                        <Button 
                          className="w-full gap-2 rounded-xl" 
                          onClick={() => handleVerify(artisan.id)}
                          disabled={verifyMutation.isPending}
                        >
                          <ShieldCheck className="size-4" />
                          Approve Verify
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full gap-2 rounded-xl" disabled>
                          <UserCheck className="size-4" />
                          Already Verified
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="shrink-0 rounded-xl">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem className="gap-2">
                            <ExternalLink className="size-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-danger focus:text-danger">
                            <Clock className="size-4" /> Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
  );
}
