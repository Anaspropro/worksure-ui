import Image from "next/image";

export default function DashboardLoadingState() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-screen max-h-svh flex items-center justify-center">
        <Image src="/logo.png" alt="logo" height={100} width={100} className="text-center pulse-slow h-auto w-auto" />
      </div>
    </main>
  );
}
