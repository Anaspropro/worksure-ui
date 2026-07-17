import React, { useEffect } from 'react';
import { Bell, Check, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { 
  useNotifications, 
  useUnreadCount, 
  useMarkAsRead, 
  useMarkAllAsRead 
} from '../api/queries';

export const NotificationCenter = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate([id]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount !== undefined && unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-full text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="text-sm font-semibold">Notifications</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8"
            onClick={handleMarkAllRead}
            disabled={!unreadCount || unreadCount === 0 || markAllAsRead.isPending}
          >
            Mark all as read
          </Button>
        </div>
        
        <ScrollArea className="h-[400px]">
          {status === 'pending' ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : status === 'error' ? (
            <div className="p-4 text-center text-sm text-destructive">Error loading notifications</div>
          ) : (
            <div className="flex flex-col">
              {data.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.data.map((notification: any) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${!notification.readAt ? 'bg-muted/20' : ''}`}
                      onClick={() => handleNotificationClick(notification.id, !!notification.readAt)}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.readAt && (
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.payload?.message || 'New notification'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
              
              {data.pages[0]?.data?.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                  <Bell className="h-8 w-8 text-muted-foreground/50" />
                  <p>No notifications yet</p>
                </div>
              )}

              {hasNextPage && (
                <Button 
                  variant="ghost" 
                  className="w-full my-2 text-xs"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
