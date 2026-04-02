import UserAvatar from "@/components/app-shell/UserAvatar";
import type { User } from "@/types";

export default function SidebarProfile({ user }: { user: User }) {
  return (
    <div className="shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ">
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />
        <div className="min-w-0">
          <p className="truncate font-normal">{user.name}</p>
          <p className="mt-1 truncate text-sm text-slate-300">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
