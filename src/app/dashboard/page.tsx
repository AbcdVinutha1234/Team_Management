
"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Search, Sparkles, Loader2, Calendar, Target } from "lucide-react";
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

  // Stable query for tasks assigned to the current user
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isMounted) return null;
    return query(
      collection(db, "tasks"),
      where("assignedToId", "==", user.uid),
      limit(50)
    );
  }, [db, user?.uid, isMounted]);

  // Stable query for projects
  const projectsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid || !isMounted) return null;
    return query(
      collection(db, "projects"),
      limit(20)
    );
  }, [db, user?.uid, isMounted]);

  const { data: allTasks, isLoading: tasksLoading } = useCollection<Task>(tasksQuery);
  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

  // Filter for priority tasks (not done, limited to 5)
  const priorityTasks = allTasks 
    ? allTasks
        .filter(t => t.status !== "Done")
        .sort((a, b) => {
          const priorities = { Critical: 0, High: 1, Medium: 2, Low: 3 };
          return (priorities[a.priority as keyof typeof priorities] || 4) - (priorities[b.priority as keyof typeof priorities] || 4);
        })
        .slice(0, 5)
    : [];

  if (!isMounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
      </div>
    );
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-background border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-headline tracking-tight text-primary">Workspace</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search your tasks..." 
                  className="pl-10 w-64 bg-muted/30 border-none focus-visible:ring-1" 
                  suppressHydrationWarning 
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                {allTasks && allTasks.some(t => t.priority === 'Critical' && t.status !== 'Done') && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
                )}
              </Button>
              <CreateTaskModal />
            </div>
          </header>
          
          <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
            <section className="space-y-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black font-headline tracking-tight">Welcome back, {displayName}</h2>
                <p className="text-muted-foreground">
                  {tasksLoading ? "Checking your tasks..." : `You have ${allTasks?.filter(t => t.status !== 'Done').length || 0} active tasks.`}
                </p>
              </div>
              <StatsGrid tasks={allTasks || []} projectsCount={projects?.length || 0} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                    <CardTitle className="text-lg font-bold font-headline">Priority Focus</CardTitle>
                    <Link href="/tasks">
                      <Button variant="link" className="text-primary p-0 h-auto font-bold text-xs uppercase tracking-wider">View All Tasks</Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {tasksLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
                        </div>
                      ) : priorityTasks.length > 0 ? (
                        priorityTasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors group">
                            <div className="flex items-center gap-5">
                              <div className={`w-1.5 h-12 rounded-full transition-all group-hover:scale-y-110 ${
                                task.priority === "Critical" ? "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.3)]" : 
                                task.priority === "High" ? "bg-orange-500" : "bg-primary"
                              }`} />
                              <div>
                                <p className="font-bold text-base group-hover:text-primary transition-colors">{task.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-medium text-muted-foreground">{task.status}</span>
                                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                               <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${
                                task.priority === "Critical" ? "bg-destructive/10 text-destructive" : 
                                task.priority === "High" ? "bg-orange-500/10 text-orange-600" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                          <div className="bg-muted p-4 rounded-full">
                            <Target className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-muted-foreground">No pending tasks</p>
                            <p className="text-sm text-muted-foreground/60">Enjoy your clear schedule or create a new task.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary p-10 rounded-3xl relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center">
                      <Sparkles className="text-white h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white text-3xl font-black font-headline leading-tight">Scale your <br />impact today.</h3>
                      <p className="text-primary-foreground/80 max-w-sm text-lg">Create a new project and invite your team to start collaborating in real-time.</p>
                    </div>
                    <CreateProjectModal>
                      <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl h-14 px-8 font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95">
                        Start New Project
                      </Button>
                    </CreateProjectModal>
                  </div>
                  <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-accent/30 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-accent/20 rounded-full blur-3xl" />
                </Card>
              </div>

              <div className="space-y-8">
                <RecentActivity />
                
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold font-headline">Workspace Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-2xl border border-dashed">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Use the <strong className="text-primary font-bold">AI Suggest</strong> button when creating tasks to generate detailed descriptions and actionable subtasks instantly.
                      </p>
                    </div>
                    <Link href="/team" className="block">
                      <Button variant="outline" className="w-full rounded-2xl font-bold h-11 border-primary/20 hover:bg-primary/5">
                        Invite Colleagues
                      </Button>
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
