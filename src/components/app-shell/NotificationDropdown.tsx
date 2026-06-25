"use client";

import { Bell, Trash2, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMyNotifications, useNotificationStats, useDeleteNotification } from "@/hooks/useNotifications";

export function NotificationDropdown() {
  const { data: stats } = useNotificationStats();
  const { data: notifications } = useMyNotifications();
  const deleteMutation = useDeleteNotification();

  const unreadCount = stats?.unread || 0;
  const hasUnread = unreadCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground">
          <Bell className="size-5" />
          {hasUnread && (
            <span className="absolute top-1.5 right-2 size-2 bg-destructive rounded-full border-2 border-card"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 border-border bg-card shadow-lg shadow-black/10">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{unreadCount} unread</span>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {!notifications || notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
              <Bell className="size-8 opacity-20 mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-3 p-4 border-b border-border/50 transition-colors hover:bg-muted/30 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {!notification.isRead && (
                      <span className="flex size-2 rounded-full bg-primary mt-1.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight mb-1">{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-2 uppercase font-semibold tracking-wider">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(notification.id);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
