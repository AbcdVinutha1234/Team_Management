"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, Filter, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_PROJECTS } from "@/lib/mock-data";

export default function ProjectsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-background border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-headline tracking-tight">Project Management</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl gap-2 font-semibold">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <Button className="rounded-xl px-5 font-semibold shadow-md shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </div>
          </header>
          
          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {MOCK_PROJECTS.map((project) => (
                <Card key={project.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group">
                  <div className="h-32 bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary mix-blend-multiply" />
                    <img 
                      src={`https://picsum.photos/seed/${project.id}/600/400`} 
                      className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                      alt={project.name}
                    />
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="-mt-12 relative z-10">
                    <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-4">
                       <Badge variant={project.status === 'Active' ? 'default' : 'secondary'} className="rounded-full mb-2">
                        {project.status}
                      </Badge>
                      <CardTitle className="text-xl font-bold font-headline leading-tight">{project.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground uppercase tracking-wider">Progress</span>
                        <span className="text-primary">65%</span>
                      </div>
                      <Progress value={65} className="h-2 rounded-full" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex -space-x-3 overflow-hidden">
                        {project.members.map((memberId, i) => (
                          <Avatar key={memberId} className="border-2 border-background w-8 h-8">
                            <AvatarImage src={`https://picsum.photos/seed/${memberId}/100/100`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="flex items-center text-muted-foreground text-xs gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Created {isMounted ? new Date(project.createdAt).toLocaleDateString() : '...'}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button variant="outline" className="w-full rounded-2xl group/btn hover:bg-primary hover:text-white transition-all">
                      View Project Details <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <button className="border-2 border-dashed border-muted-foreground/20 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:bg-muted/30 hover:border-primary/40 transition-all group">
                <div className="p-4 bg-muted/50 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Plus className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">New Project</p>
                  <p className="text-sm">Kickoff something big today</p>
                </div>
              </button>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
