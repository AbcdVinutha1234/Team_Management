
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    user: { name: "Sarah Chen", avatar: "https://picsum.photos/seed/user2/100/100" },
    action: "completed task",
    target: "Mobile Menu Design",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: { name: "James Wilson", avatar: "https://picsum.photos/seed/user3/100/100" },
    action: "added comment to",
    target: "Database Schema",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: { name: "Alex Rivera", avatar: "https://picsum.photos/seed/user1/100/100" },
    action: "created project",
    target: "Marketing Q2 Strategy",
    time: "1 day ago",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-headline">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 items-start">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm leading-none">
                <span className="font-semibold">{activity.user.name}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium text-primary cursor-pointer hover:underline">
                  {activity.target}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
