"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Shield, MoreVertical, Search, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_USERS } from "@/lib/mock-data";
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

export default function TeamPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // For the Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"Admin" | "Member">("Member");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemoveMember = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({
      title: "Member removed",
      description: `${name} has been removed from the team.`,
    });
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: User = {
      id: `u${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
    };

    setUsers((prev) => [...prev, newUser]);
    setIsInviteModalOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Member");

    toast({
      title: "Invitation sent",
      description: `${newUserName} has been added to the team.`,
    });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-background border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-headline tracking-tight">Team Members</h1>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl px-5 font-semibold shadow-md shadow-primary/20">
                    <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold font-headline">Invite New Member</DialogTitle>
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
                        className="rounded-xl"
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
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUserRole}
                        onValueChange={(value: "Admin" | "Member") => setNewUserRole(value)}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                          <SelectItem value="Member">Member (Limited Access)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full rounded-xl font-bold">
                        Send Invitation
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full bg-white px-4 py-1 border-none shadow-sm text-xs font-bold uppercase tracking-wider">
                  Total: {users.length} Members
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-sm">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-bold font-headline">{user.name}</CardTitle>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold px-2 py-0 mt-1">
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
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary/60" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary/60" />
                        <span>{user.role === 'Admin' ? 'Full Access' : 'Limited Access'}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl text-xs font-bold h-9">
                        View Profile
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveMember(user.id, user.name)}
                        className="rounded-xl text-xs font-bold h-9 text-destructive hover:bg-destructive/5 hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="border-2 border-dashed border-muted-foreground/20 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:bg-muted/30 hover:border-primary/40 transition-all group min-h-[220px]"
              >
                <div className="p-4 bg-muted/50 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Plus className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">Add Collaborator</p>
                  <p className="text-sm">Grow your project team</p>
                </div>
              </button>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
