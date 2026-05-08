"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="w-full border-border bg-card shadow-xl">
            <CardHeader className="space-y-5 text-center">
              <motion.div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <SearchX className="size-8" />
              </motion.div>
              <div className="space-y-2">
                <CardTitle className="text-4xl tracking-tight text-foreground">Page not found</CardTitle>
                <CardDescription className="mx-auto max-w-xl text-base leading-7">
                  The page you tried to open does not exist anymore, may have moved, or was never
                  part of this workspace route map.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="">
                <motion.div
                  className="rounded-2xl border border-border bg-surface p-4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Home className="mt-0.5 size-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Start from home</p>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        If you followed an old or broken link, returning home is the quickest reset.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="flex flex-wrap justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Button asChild>
                  <Link href="/">Go home</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/auth/login">Open login</Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
