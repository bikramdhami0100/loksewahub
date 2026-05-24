"use client";

import { Clock } from "lucide-react";

export interface Activity {
  title: string;
  date: string;
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) {
    return <p className="text-sm text-muted-foreground">Start practicing to see your activity!</p>;
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 5).map((activity, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="flex-1">{activity.title}</span>
          <span className="text-muted-foreground text-xs">{activity.date}</span>
        </div>
      ))}
    </div>
  );
}
