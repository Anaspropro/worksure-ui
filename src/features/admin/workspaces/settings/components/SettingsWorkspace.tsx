"use client";

import { useState } from "react";
import { useSystemConfig, useAdminConfigMutations } from "@/features/admin/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import { Settings, Save, Bell } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";

export function SettingsWorkspace() {
  const { data: configs, isLoading } = useSystemConfig();
  const { updateConfig } = useAdminConfigMutations();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  const getConfig = (key: string, defaultValue: any) => {
    const config = configs?.find((c: any) => c.key === key);
    return config ? config.value : defaultValue;
  };

  const handleSave = (key: string, value: any, description?: string) => {
    updateConfig.mutate(
      { key, value, description },
      {
        onSuccess: () => {
          toast.success("Configuration updated successfully");
          setEditingKey(null);
        },
        onError: (err: any) => toast.error(err.message || "Failed to update configuration"),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Configuration</h1>
        <p className="text-muted-foreground mt-1">Manage global platform settings and feature flags.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              Financial Settings
            </CardTitle>
            <CardDescription>Adjust global platform fees and escrow settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platform_fee">Global Platform Fee (%)</Label>
              <div className="flex gap-2">
                <Input 
                  id="platform_fee"
                  type="number" 
                  defaultValue={getConfig('PLATFORM_FEE_PERCENTAGE', 5)}
                  disabled={editingKey !== 'PLATFORM_FEE_PERCENTAGE'}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                {editingKey === 'PLATFORM_FEE_PERCENTAGE' ? (
                  <Button onClick={() => handleSave('PLATFORM_FEE_PERCENTAGE', Number(editValue), 'Global platform fee percentage deducted from escrow payouts')}>
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => {
                    setEditingKey('PLATFORM_FEE_PERCENTAGE');
                    setEditValue(String(getConfig('PLATFORM_FEE_PERCENTAGE', 5)));
                  }}>
                    Edit
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">This fee is applied to all completed jobs.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              Feature Flags
            </CardTitle>
            <CardDescription>Toggle platform features on or off.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Disable new signups and job creations.</p>
              </div>
              <Switch 
                checked={getConfig('MAINTENANCE_MODE', false)}
                onCheckedChange={(checked) => handleSave('MAINTENANCE_MODE', checked, 'System-wide maintenance mode')}
                disabled={updateConfig.isPending}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Artisan Registrations</Label>
                <p className="text-sm text-muted-foreground">Allow new artisans to create profiles.</p>
              </div>
              <Switch 
                checked={getConfig('ALLOW_NEW_ARTISANS', true)}
                onCheckedChange={(checked) => handleSave('ALLOW_NEW_ARTISANS', checked, 'Toggle new artisan registrations')}
                disabled={updateConfig.isPending}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              System Announcements
            </CardTitle>
            <CardDescription>Broadcast an alert to all active users on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              alert("System announcement feature coming in Phase 5!");
            }}>
              <div className="space-y-2">
                <Label htmlFor="announcement_title">Announcement Title</Label>
                <Input id="announcement_title" placeholder="e.g. Scheduled Maintenance Notice" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcement_message">Message Body</Label>
                <Input id="announcement_message" placeholder="Details about the announcement..." required />
              </div>
              <Button type="submit" variant="default">Broadcast Announcement</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
