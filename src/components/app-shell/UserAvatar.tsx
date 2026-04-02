import type { User } from "@/types";
import Image from "next/image";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function UserAvatar({
  user,
  className = "",
}: {
  user: User;
  className?: string;
}) {
  if (user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt={user.name}
        className={`h-6 w-6 rounded-2xl object-cover ring-1 ring-white/15 ${className}`.trim()}
      />
    );
  }

  return (
    <div
      aria-label={user.name}
      className={`flex h-6 w-6 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981,#059669)] text-sm font-semibold text-white shadow-[0_16px_36px_-20px_rgba(16,185,129,0.85)] ${className}`.trim()}
    >
      {getInitials(user.name)}
    </div>
  );
}
