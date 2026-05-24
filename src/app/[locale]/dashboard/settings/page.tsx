"use client";

import { useState } from "react";
import { useLocale } from "@/providers/locale-provider";
import { useGsapFadeIn } from "@/hooks/use-gsap";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Globe,
  Moon,
  Bell,
  CreditCard,
  Save,
  Camera,
} from "lucide-react";

function Switch({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { t, locale, setLocale } = useLocale();
  const headerRef = useGsapFadeIn();
  const profileRef = useGsapFadeIn(0.1);
  const preferencesRef = useGsapFadeIn(0.2);
  const notificationsRef = useGsapFadeIn(0.3);
  const subscriptionRef = useGsapFadeIn(0.4);

  const [name, setName] = useState("Bikram Dhami");
  const [email, setEmail] = useState("bikram@example.com");
  const [language, setLanguage] = useState(locale);
  const [theme, setTheme] = useState("system");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleLanguageChange = (value: string) => {
    setLanguage(value as "en" | "ne");
    setLocale(value as "en" | "ne");
  };

  return (
    <div className="space-y-6 pb-8 max-w-3xl">
      <div ref={headerRef}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          {t("dashboard.settings")}
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <Card ref={profileRef}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar name={name} size="lg" />
              <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card ref={preferencesRef}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            Preferences
          </CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="language">Language</Label>
              <p className="text-xs text-muted-foreground">Choose your preferred language</p>
            </div>
            <Select
              id="language"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              options={[
                { value: "en", label: t("common.english") },
                { value: "ne", label: t("common.nepali") },
              ]}
              className="w-36"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-xs text-muted-foreground">Select display theme</p>
            </div>
            <Select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              options={[
                { value: "system", label: "System" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              className="w-36"
            />
          </div>
        </CardContent>
      </Card>

      <Card ref={notificationsRef}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {t("dashboard.notifications")}
          </CardTitle>
          <CardDescription>Control what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notif">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch id="email-notif" checked={emailNotifications} onChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notif">Push Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive push notifications</p>
            </div>
            <Switch id="push-notif" checked={pushNotifications} onChange={setPushNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-xs text-muted-foreground">Weekly summary of new notices and materials</p>
            </div>
            <Switch id="weekly-digest" checked={weeklyDigest} onChange={setWeeklyDigest} />
          </div>
        </CardContent>
      </Card>

      <Card ref={subscriptionRef}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            Subscription
          </CardTitle>
          <CardDescription>Your current plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Free Plan</p>
              <p className="text-sm text-muted-foreground">Basic access to study materials</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
          <Button variant="outline" className="w-full">
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
