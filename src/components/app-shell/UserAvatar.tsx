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
        className={` ${className}`.trim()}
      />
    );
  }

  return (
    <div
      aria-label={user.name}>
      {getInitials(user.name)}
    </div>
  );
}
