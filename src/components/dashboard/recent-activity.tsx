
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { Task } from "@/lib/types";
import { Loader2 } from "lucide-react";

export function RecentActivity() {
  const [isMounted, setIsMounted] = useState(false);
  const db = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activityQuery = useMemoFirebase(() => {
    if (!db || !user || !isMounted) return null;
    return query(
      collection(db, "tasks"),
      where("assignedToId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
  }, [db, user?.uid, isMounted]);

  const { data: tasks, isLoading } = useCollection<Task>(activityQuery);

  if (!isMounted) return null;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-headline">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="flex gap-4 items-start">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={`https://picsum.photos/seed/${task.assignedToId}/100/100`} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm leading-none">
                  <span className="font-semibold">You</span>{" "}
                  <span className="text-muted-foreground">updated task</span>{" "}
                  <span className="font-medium text-primary cursor-pointer hover:underline">
                    {task.title}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
        )}
      </CardContent>
    </Card>
  );
}
