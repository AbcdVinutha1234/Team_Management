
'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    setIsSubmitting(true);

    const projectId = `proj_${Date.now()}`;
    const projectData = {
      id: projectId,
      name,
      description,
      status: 'Active',
      createdBy: user.uid,
      members: {
        [user.uid]: 'Admin'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDoc(doc(db, 'projects', projectId), projectData)
      .then(() => {
        toast({
          title: "Project created",
          description: `"${name}" has been launched successfully.`,
        });
        setOpen(false);
        setName('');
        setDescription('');
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: `projects/${projectId}`,
          operation: 'create',
          requestResourceData: projectData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-5 font-semibold shadow-md shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline">New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">Project Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Website Overhaul" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border-muted-foreground/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea 
              id="description" 
              placeholder="What's the primary goal of this project?" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-muted-foreground/20 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 font-bold">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Launch Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
