
"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Filter, ChevronRight, Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const db = useFirestore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const projectsQuery = useMemoFirebase(() => {
    if (!isMounted || !db) return null;
    return query(collection(db, "projects"), orderBy("createdAt", "desc"));
  }, [isMounted, db]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  if (!isMounted) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-background border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-headline tracking-tight text-primary">Project Hub</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl gap-2 font-semibold border-muted-foreground/20">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <CreateProjectModal />
            </div>
          </header>
          
          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <Card key={project.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group bg-white">
                    <div className="h-32 bg-primary/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                      <div className="absolute top-4 right-4">
                        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="-mt-12 relative z-10">
                      <div className="bg-white p-4 rounded-2xl shadow-md inline-block mb-4 border border-primary/5">
                         <Badge variant={project.status === 'Active' ? 'default' : 'secondary'} className="rounded-full mb-2">
                          {project.status}
                        </Badge>
                        <CardTitle className="text-xl font-bold font-headline leading-tight truncate max-w-[200px]">{project.name}</CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 text-sm leading-relaxed min-h-[40px]">
                        {project.description || "No description provided."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground uppercase tracking-wider">Progress</span>
                          <span className="text-primary">0%</span>
                        </div>
                        <Progress value={0} className="h-2 rounded-full" />
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-dashed">
                        <div className="flex -space-x-3 overflow-hidden">
                          {project.members && Object.keys(project.members).slice(0, 3).map((memberId) => (
                            <Avatar key={memberId} className="border-2 border-background w-8 h-8">
                              <AvatarImage src={`https://picsum.photos/seed/${memberId}/100/100`} />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="flex items-center text-muted-foreground text-[10px] gap-1.5 font-bold uppercase tracking-tighter">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Started {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 pb-6 pt-0">
                      <Button variant="outline" className="w-full rounded-2xl group/btn hover:bg-primary hover:text-white border-primary/20 transition-all font-bold">
                        View Details <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-white/50 rounded-3xl border-2 border-dashed border-primary/10">
                <div className="bg-primary/5 p-6 rounded-full">
                  <Plus className="h-12 w-12 text-primary/40" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline">No projects found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">Kickstart your productivity by creating your first team project today.</p>
                </div>
                <CreateProjectModal />
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
