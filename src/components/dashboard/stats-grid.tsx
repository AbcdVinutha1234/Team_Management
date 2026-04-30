
"use client";

import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Target 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Total Projects",
    value: "12",
    icon: Target,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Tasks Done",
    value: "48",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "In Progress",
    value: "24",
    icon: Clock,
    color: "text-accent-foreground",
    bgColor: "bg-accent/20",
  },
  {
    label: "Overdue",
    value: "3",
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </h3>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-2xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
