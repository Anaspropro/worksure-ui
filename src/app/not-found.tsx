import Link from "next/link";
import { Compass, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[linear-gradient(160deg,#f3fff8_0%,#f8fafc_55%,#eef5ff_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <Card className="w-full border-border/80 bg-white/95 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.28)]">
          <CardHeader className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft text-primary-dark">
              <SearchX className="size-8" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl tracking-tight text-slate-950">Page not found</CardTitle>
              <CardDescription className="mx-auto max-w-xl text-base leading-7">
                The page you tried to open does not exist anymore, may have moved, or was never
                part of this workspace route map.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface-muted/60 p-4">
                <div className="flex items-start gap-3">
                  <Compass className="mt-0.5 size-5 text-secondary" />
                  <div>
                    <p className="font-medium text-foreground">Try a known route</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      Head back to the dashboard, jobs, wallet, or auth pages from a safe entry point.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface-muted/60 p-4">
                <div className="flex items-start gap-3">
                  <Home className="mt-0.5 size-5 text-primary-dark" />
                  <div>
                    <p className="font-medium text-foreground">Start from home</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      If you followed an old or broken link, returning home is the quickest reset.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/">Go home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/login">Open login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
