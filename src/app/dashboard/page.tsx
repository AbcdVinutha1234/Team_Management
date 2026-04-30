"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreateProject = () => {
    toast({
      title: "Action captured",
      description: "Project creation feature is coming in the next update!",
    });
  };

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
                <Input placeholder="Search tasks..." className="pl-10 w-64 bg-muted/30 border-none focus-visible:ring-1" />
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
                <h2 className="text-xl font-bold font-headline">Welcome back, Alex!</h2>
                <p className="text-muted-foreground">You have 5 tasks to focus on today.</p>
              </div>
              <StatsGrid />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold font-headline">My Priority Tasks</CardTitle>
                    <Button variant="link" className="text-primary p-0 h-auto">View all</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {[
                        { title: "Review Website Mockups", project: "Website Redesign", due: "Today", priority: "High" },
                        { title: "Fix Dashboard API Integration", project: "Internal Tools", due: "Tomorrow", priority: "Urgent" },
                        { title: "Team Sync Meeting", project: "Operations", due: "In 2 hours", priority: "Medium" }
                      ].map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors border-b last:border-none">
                          <div className="flex items-center gap-4">
                            <div className={`w-1.5 h-10 rounded-full ${
                              task.priority === "Urgent" ? "bg-destructive" : task.priority === "High" ? "bg-orange-500" : "bg-primary"
                            }`} />
                            <div>
                              <p className="font-semibold">{task.title}</p>
                              <p className="text-xs text-muted-foreground">{task.project}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{task.due}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                              task.priority === "Urgent" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary p-8 relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-primary-foreground text-2xl font-bold font-headline">Ready for your next project?</h3>
                    <p className="text-primary-foreground/80 max-w-md">Collaborate with your team members in real-time and track progress effortlessly.</p>
                    <Button variant="secondary" onClick={handleCreateProject} className="font-bold rounded-xl px-6">Create New Project</Button>
                  </div>
                  <div className="absolute top-0 right-0 h-full w-1/3 bg-accent opacity-20 skew-x-12 translate-x-1/2" />
                  <Sparkles className="absolute bottom-4 right-8 h-24 w-24 text-primary-foreground/10" />
                </Card>
              </div>

              <div className="space-y-8">
                <RecentActivity />
                
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold font-headline">Team Members</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {["Sarah Chen", "James Wilson", "Maya Lopez", "David Kim"].map((name, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://picsum.photos/seed/member${i}/100/100`} />
                            <AvatarFallback>{name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => toast({ title: "Invite link copied", description: "Share the link with your teammate to join." })} className="w-full rounded-xl mt-2 border-dashed">
                      Invite Member
                    </Button>
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
