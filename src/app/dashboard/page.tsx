
"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Search, Sparkles, Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import { Task, Project } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const priorityTasksQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isMounted) return null;
    return query(
      collection(db, "tasks"),
      where("assignedToId", "==", user.uid),
      where("status", "in", ["To Do", "In Progress"]),
      limit(5)
    );
  }, [db, user?.uid, isMounted]);

  const allTasksQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isMounted) return null;
    return query(
      collection(db, "tasks"), 
      where("assignedToId", "==", user.uid)
    );
  }, [db, user?.uid, isMounted]);

  const projectsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isMounted) return null;
    return query(
      collection(db, "projects"), 
      where(`members.${user.uid}`, "!=", null)
    );
  }, [db, user?.uid, isMounted]);

  const { data: priorityTasks, isLoading: tasksLoading } = useCollection<Task>(priorityTasksQuery);
  const { data: allTasks } = useCollection<Task>(allTasksQuery);
  const { data: projects } = useCollection<Project>(projectsQuery);

  if (!isMounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-background border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-headline tracking-tight">Personal Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tasks..." 
                  className="pl-10 w-64 bg-muted/30 border-none focus-visible:ring-1" 
                  suppressHydrationWarning 
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-background" />
              </Button>
              <CreateTaskModal />
            </div>
          </header>
          
          <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
            <section>
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-xl font-bold font-headline">Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!</h2>
                <p className="text-muted-foreground">Here is what's happening in your workspace today.</p>
              </div>
              <StatsGrid tasks={allTasks || []} projectsCount={projects?.length || 0} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold font-headline">My Priority Tasks</CardTitle>
                    <Link href="/tasks">
                      <Button variant="link" className="text-primary p-0 h-auto">View all</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {tasksLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : priorityTasks && priorityTasks.length > 0 ? (
                        priorityTasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors border-b last:border-none">
                            <div className="flex items-center gap-4">
                              <div className={`w-1.5 h-10 rounded-full ${
                                task.priority === "Critical" ? "bg-destructive" : task.priority === "High" ? "bg-orange-500" : "bg-primary"
                              }`} />
                              <div>
                                <p className="font-semibold">{task.title}</p>
                                <p className="text-xs text-muted-foreground">{task.status}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                <Calendar className="h-3 w-3" />
                                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                                task.priority === "Critical" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center text-muted-foreground">
                          <p>No active tasks found. Time to relax!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary p-8 relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-primary-foreground text-2xl font-bold font-headline">Ready for your next project?</h3>
                    <p className="text-primary-foreground/80 max-w-md">Collaborate with your team members in real-time and track progress effortlessly.</p>
                    <CreateProjectModal />
                  </div>
                  <div className="absolute top-0 right-0 h-full w-1/3 bg-accent opacity-20 skew-x-12 translate-x-1/2" />
                  <Sparkles className="absolute bottom-4 right-8 h-24 w-24 text-primary-foreground/10" />
                </Card>
              </div>

              <div className="space-y-8">
                <RecentActivity />
                
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold font-headline">Active Workspace</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground italic">You are currently active in your professional workspace. Connect with your team in the Team tab.</p>
                    <Link href="/team">
                      <Button variant="outline" className="w-full rounded-xl font-bold mt-2">Manage Team</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
