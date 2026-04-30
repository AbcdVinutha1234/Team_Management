"use client";

import { useEffect, useState, useMemo } from "react";
import { AppSidebar } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Shield, MoreVertical, Search, UserPlus, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function TeamPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const db = useFirestore();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"Admin" | "Member">("Member");
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const usersQuery = useMemo(() => {
    if (!isMounted || !db) return null;
    return query(collection(db, "users"), orderBy("name"));
  }, [isMounted, db]);

  const { data: users, loading } = useCollection<User>(usersQuery);

  const handleRemoveMember = (id: string, name: string) => {
    if (!db) return;
    deleteDoc(doc(db, 'users', id))
      .then(() => {
        toast({
          title: "Member removed",
          description: `${name} has been removed from the team.`,
        });
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `users/${id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !db) return;
    setIsInviting(true);

    const inviteId = `inv_${Date.now()}`;
    const userData = {
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatarUrl: `https://picsum.photos/seed/${inviteId}/100/100`,
      createdAt: serverTimestamp(),
    };

    setDoc(doc(db, 'users', inviteId), userData)
      .then(() => {
        toast({
          title: "Invitation recorded",
          description: `User ${newUserName} added to workspace. Note: Email delivery is not configured.`,
        });
        setIsInviteModalOpen(false);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserRole("Member");
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: `users/${inviteId}`,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsInviting(false);
      });
  };

  const filteredUsers = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-background border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-headline tracking-tight text-primary">Team Management</h1>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl px-5 font-semibold shadow-md shadow-primary/20">
                    <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl p-8">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold font-headline">Invite Collaborator</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleInviteMember} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Jane Doe"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                        className="rounded-xl border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        required
                        className="rounded-xl border-muted-foreground/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUserRole}
                        onValueChange={(value: "Admin" | "Member") => setNewUserRole(value)}
                      >
                        <SelectTrigger className="rounded-xl border-muted-foreground/20">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                          <SelectItem value="Member">Member (Limited Access)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isInviting} className="w-full rounded-xl font-bold shadow-lg shadow-primary/20">
                        {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite Member"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10 rounded-xl border-none bg-white shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers?.map((user) => (
                  <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-sm">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-bold font-headline">{user.name}</CardTitle>
                          <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold mt-1">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-2 rounded-xl">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="truncate font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4 text-primary/60" />
                          <span>{user.role === 'Admin' ? 'Admin Access' : 'Limited Access'}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t flex gap-2">
                        <Button variant="outline" className="flex-1 rounded-xl text-xs font-bold h-9 border-primary/20 hover:bg-primary/5">
                          View Profile
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveMember(user.id, user.name)}
                          className="rounded-xl text-xs font-bold h-9 text-destructive hover:bg-destructive/5"
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="border-2 border-dashed border-muted-foreground/20 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:bg-primary/5 hover:border-primary/30 transition-all group min-h-[220px] bg-white/50"
                >
                  <div className="p-4 bg-primary/5 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <UserPlus className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-primary/80">Add Collaborator</p>
                    <p className="text-sm">Click to invite a member</p>
                  </div>
                </button>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
