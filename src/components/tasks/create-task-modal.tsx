
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
import { Sparkles, Loader2, Plus, Check } from "lucide-react";
import { aiTaskDetailSuggestion } from "@/ai/flows/ai-task-detail-suggestion";
import { useToast } from "@/hooks/use-toast";

export function CreateTaskModal({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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
        projectContext: "Task management for a professional team." 
      });
      
      setDescription(result.detailedDescription);
      setSubtasks(result.subtasks);
      
      toast({
        title: "AI Suggestion applied",
        description: "Task description and subtasks have been generated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "AI Failed",
        description: "Could not generate task details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubtasks([]);
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
      <DialogContent className="sm:max-w-[550px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline">Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Task Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Design user login flow" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-muted-foreground/20 focus-visible:ring-primary"
            />
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
                {isGenerating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                AI Auto-fill
              </Button>
            </div>
            <Textarea 
              id="description" 
              placeholder="Describe what needs to be done..."
              className="min-h-[120px] rounded-xl border-muted-foreground/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {subtasks.length > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-semibold">Suggested Subtasks</Label>
              <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-dashed border-primary/20">
                {subtasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2 group">
                    <div className="h-5 w-5 rounded border border-primary/30 flex items-center justify-center bg-white">
                      <Check className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xs text-muted-foreground">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={resetForm} className="rounded-xl">Cancel</Button>
          <Button className="rounded-xl px-8 font-bold" onClick={resetForm}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
