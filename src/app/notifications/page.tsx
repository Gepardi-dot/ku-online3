"use client";

import { useState, useEffect } from 'react';
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Loader2 } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setNotifications(userNotifications);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
        setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    const notifRef = doc(db, "notifications", id);
    try {
      await updateDoc(notifRef, { isRead: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };


  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Notifications</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Your Alerts</CardTitle>
                <CardDescription>Stay up to date with the latest activity on your account.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
                {!loading && notifications.length === 0 && (
                     <div className="flex flex-col items-center justify-center text-center min-h-[30vh] bg-muted/50 rounded-lg p-8">
                        <Bell className="w-20 h-20 text-muted-foreground/30 mb-4" />
                        <h2 className="text-2xl font-semibold">No notifications yet</h2>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                           We'll let you know when there's something new for you.
                        </p>
                    </div>
                )}
                {!loading && notifications.length > 0 && (
                    <div className="space-y-4">
                        {notifications.map(notif => {
                             const timeAgo = notif.createdAt?.toDate ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'a while ago';
                             return (
                                 <Link key={notif.id} href={notif.href} onClick={() => markAsRead(notif.id)}>
                                    <div className={cn(
                                        "block p-4 rounded-lg border transition-colors hover:bg-muted/80",
                                        notif.isRead ? "bg-transparent text-muted-foreground" : "bg-muted font-semibold"
                                    )}>
                                        <p>{notif.message}</p>
                                        <p className={cn("text-xs mt-1", notif.isRead ? "text-muted-foreground/80" : "text-primary")}>{timeAgo}</p>
                                    </div>
                                </Link>
                             )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
