import React from 'react';
import { usePreferences, useUpdatePreference } from '../api/queries';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NOTIFICATION_CATEGORIES = [
  { id: 'FINANCIAL', label: 'Financial', description: 'Payments, escrow updates, and wallet changes' },
  { id: 'CONTRACTS', label: 'Contracts', description: 'New contracts, milestones, and submissions' },
  { id: 'PROPOSALS', label: 'Proposals', description: 'Updates on your job proposals' },
  { id: 'SYSTEM', label: 'System', description: 'Platform announcements and security alerts' },
];

export const NotificationSettings = () => {
  const { data: preferences, isLoading } = usePreferences();
  const updatePreference = useUpdatePreference();

  const handleToggle = (channel: string, category: string, enabled: boolean) => {
    updatePreference.mutate({ channel, category, enabled });
  };

  const isEnabled = (channel: string, category: string) => {
    if (!preferences) return true; // Default to true if not loaded
    const pref = preferences.find((p: any) => p.channel === channel && p.category === category);
    return pref ? pref.enabled : true; // Default to true if no explicit preference
  };

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Choose how you want to be notified about different events on WorkSure.
        </p>
      </div>

      <div className="grid gap-6">
        {NOTIFICATION_CATEGORIES.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{category.label}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>In-App Notifications</Label>
                    <p className="text-[13px] text-muted-foreground">Receive updates within the WorkSure application.</p>
                  </div>
                  <Switch 
                    checked={isEnabled('IN_APP', category.id)} 
                    onCheckedChange={(checked: any) => handleToggle('IN_APP', category.id, checked)}
                    disabled={updatePreference.isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-[13px] text-muted-foreground">Receive updates to your registered email address.</p>
                  </div>
                  <Switch 
                    checked={isEnabled('EMAIL', category.id)} 
                    onCheckedChange={(checked: any) => handleToggle('EMAIL', category.id, checked)}
                    disabled={updatePreference.isPending}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
