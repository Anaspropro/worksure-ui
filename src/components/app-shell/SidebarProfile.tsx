import UserAvatar from "@/components/app-shell/UserAvatar";
import type { User } from "@/types";

export default function SidebarProfile({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={user} className="h-10 w-10 rounded-full object-cover" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-current">{user.name}</p>
        <p className="truncate text-xs text-current/70">{user.email}</p>
      </div>
    </div>
  );
}
