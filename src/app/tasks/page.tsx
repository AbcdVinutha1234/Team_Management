
import { AppSidebar } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, CheckCircle2, Circle } from "lucide-react";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { MOCK_TASKS } from "@/lib/mock-data";

export default function TasksPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-background border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-headline tracking-tight">My Tasks</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <CreateTaskModal />
            </div>
          </header>
          
          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            <Tabs defaultValue="all" className="w-full space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <TabsList className="bg-muted/50 p-1 rounded-2xl">
                  <TabsTrigger value="all" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">All Tasks</TabsTrigger>
                  <TabsTrigger value="todo" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">To Do</TabsTrigger>
                  <TabsTrigger value="in-progress" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">In Progress</TabsTrigger>
                  <TabsTrigger value="done" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Completed</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <span className="px-3 py-1 bg-white border rounded-full shadow-sm">Sorted by: Due Date</span>
                </div>
              </div>

              <TabsContent value="all" className="space-y-4 m-0">
                <div className="grid grid-cols-1 gap-4">
                  {MOCK_TASKS.map((task) => (
                    <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-3xl overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
                          <div className="flex-shrink-0">
                            {task.status === "Done" ? (
                              <div className="bg-green-100 p-3 rounded-2xl">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                              </div>
                            ) : task.status === "In Progress" ? (
                              <div className="bg-accent/20 p-3 rounded-2xl">
                                <Clock className="h-6 w-6 text-accent-foreground" />
                              </div>
                            ) : (
                              <div className="bg-muted p-3 rounded-2xl">
                                <Circle className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{task.title}</h3>
                              <Badge variant="outline" className="rounded-full bg-muted/30 border-none font-bold text-[10px] uppercase">
                                {task.projectId === 'p1' ? 'Website Redesign' : 'Internal'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className={`text-sm font-medium ${new Date(task.dueDate) < new Date() ? 'text-destructive font-bold' : ''}`}>
                                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 border border-background">
                                <AvatarImage src={`https://picsum.photos/seed/${task.assigneeId}/100/100`} />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium hidden lg:inline">Assigned to You</span>
                            </div>
                            
                            <Button variant="ghost" className="rounded-xl font-bold text-primary">Edit</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {["todo", "in-progress", "done"].map((statusValue) => (
                <TabsContent key={statusValue} value={statusValue} className="m-0">
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4 bg-white/50 rounded-3xl border-2 border-dashed border-muted/50">
                    <div className="p-4 bg-muted/50 rounded-full">
                      <Target className="h-10 w-10 opacity-20" />
                    </div>
                    <p className="font-medium">All caught up here!</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Internal icon for generic usage
function Target({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  );
}
