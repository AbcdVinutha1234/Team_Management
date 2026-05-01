
"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Sparkles, Loader2, Plus, Check } from "lucide-react";
import { aiTaskDetailSuggestion } from "@/ai/flows/ai-task-detail-suggestion";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { doc, setDoc, collection, query, where } from "firebase/firestore";
import { Project, Task } from "@/lib/types";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export function CreateTaskModal({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [priority, setPriority] = useState<string>("Medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  const projectsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "projects"), where(`members.${user.uid}`, "!=", null));
  }, [db, user?.uid]);

  const { data: projects } = useCollection<Project>(projectsQuery);

  const handleAISuggestion = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a task title first so AI can suggest details.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiTaskDetailSuggestion({ 
        taskTitle: title,
        projectContext: "Professional team workspace tasks." 
      });
      
      setDescription(result.detailedDescription);
      setSubtasks(result.subtasks);
      
      toast({
        title: "AI Suggestion applied",
        description: "Task description and subtasks have been generated.",
      });
    } catch (error) {
      toast({
        title: "AI Failed",
        description: "Could not generate task details.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !title || !selectedProjectId) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select a project.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const taskId = `task_${Date.now()}`;
    const project = projects?.find(p => p.id === selectedProjectId);
    
    // Denormalize members for security rule check
    const projectMembers = project?.members || { [user.uid]: 'Admin' };

    const taskData = {
      id: taskId,
      title,
      description,
      status: 'To Do',
      priority,
      projectId: selectedProjectId,
      assignedToId: user.uid,
      createdBy: user.uid,
      projectMembers: projectMembers,
      dueDate: new Date(Date.now() + 604800000).toISOString(), 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks,
    };

    setDoc(doc(db, 'tasks', taskId), taskData)
      .then(() => {
        toast({
          title: "Task created",
          description: "Task successfully saved.",
        });
        resetForm();
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: `tasks/${taskId}`,
          operation: 'create',
          requestResourceData: taskData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubtasks([]);
    setSelectedProjectId("");
    setPriority("Medium");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="rounded-xl px-5 font-semibold shadow-md shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline">Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Task Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Design user login flow" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl border-muted-foreground/20"
              suppressHydrationWarning
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-semibold">Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId} required>
                <SelectTrigger className="rounded-xl border-muted-foreground/20">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="rounded-xl border-muted-foreground/20">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={handleAISuggestion}
                disabled={isGenerating}
                className="text-xs h-8 rounded-full bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all gap-1.5"
              >
                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                AI Suggest
              </Button>
            </div>
            <Textarea 
              id="description" 
              placeholder="Describe the task..."
              className="min-h-[120px] rounded-xl border-muted-foreground/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {subtasks.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Suggested Subtasks</Label>
              <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-dashed border-primary/20">
                {subtasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-xs text-muted-foreground">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={resetForm} className="rounded-xl">Cancel</Button>
            <Button type="submit" className="rounded-xl px-8 font-bold" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
