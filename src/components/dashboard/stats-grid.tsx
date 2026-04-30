
"use client";

import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Target 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/lib/types";

interface StatsGridProps {
  tasks: Task[];
  projectsCount: number;
}

export function StatsGrid({ tasks, projectsCount }: StatsGridProps) {
  const doneTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

  const stats = [
    {
      label: "Total Projects",
      value: projectsCount.toString(),
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Tasks Done",
      value: doneTasks.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "In Progress",
      value: inProgressTasks.toString(),
      icon: Clock,
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
    },
    {
      label: "Overdue",
      value: overdueTasks.toString(),
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

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
