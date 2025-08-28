
"use client";

import { useState } from 'react';
import AppLayout from "@/components/layout/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search, SendHorizonal, Paperclip, MoreVertical, ArrowLeft } from "lucide-react";

const conversations = [
    { id: 1, name: 'Nishtiman Crafts', lastMessage: 'Is the rug still available?', timestamp: '10:40 AM', avatar: 'https://picsum.photos/seed/seller1/40/40', unread: 1, active: true },
    { id: 2, name: 'Erbil Electronics', lastMessage: 'Thank you for your purchase!', timestamp: 'Yesterday', avatar: 'https://picsum.photos/seed/seller2/40/40', unread: 0, active: false },
    { id: 3, name: 'Chic Boutique', lastMessage: 'Yes, we can ship to Sulaymaniyah.', timestamp: '3 days ago', avatar: 'https://picsum.photos/seed/seller3/40/40', unread: 0, active: false },
    { id: 4, name: 'Zanyari Bookstore', lastMessage: 'Your order has been shipped.', timestamp: '3 days ago', avatar: 'https://picsum.photos/seed/seller7/40/40', unread: 2, active: false },
];

const messages = [
    { from: 'other', text: 'Hi, is the Handwoven Kurdish Rug still available?' },
    { from: 'me', text: 'Hello! Yes, it is still available.' },
    { from: 'other', text: 'Great! Can you tell me the exact dimensions?' },
    { from: 'me', text: 'Of course. It is approximately 120cm x 180cm.' },
    { from: 'other', text: 'Perfect. I would like to buy it.' },
];


export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
    const activeConversation = selectedConversation;

    return (
        <AppLayout>
            <div className="h-[calc(100vh-8rem)] rounded-xl border bg-card text-card-foreground shadow-sm flex overflow-hidden">
                <div className={cn(
                    "w-full md:w-1/3 md:flex flex-col border-r",
                    activeConversation && "hidden md:flex"
                )}>
                    <div className="p-4 border-b">
                        <h2 className="text-2xl font-bold font-headline">Messages</h2>
                        <div className="relative mt-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search messages..." className="pl-8" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        {conversations.map(conv => (
                            <div key={conv.id} 
                                 onClick={() => setSelectedConversation(conv)}
                                 className={cn("flex items-start gap-4 p-4 cursor-pointer hover:bg-muted/50", { 'bg-muted': activeConversation?.id === conv.id })}>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={conv.avatar} alt={conv.name} />
                                    <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold truncate">{conv.name}</p>
                                        <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                                        {conv.unread > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{conv.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {activeConversation && (
                    <div className={cn(
                        "w-full md:w-2/3 flex-col",
                        activeConversation ? "flex" : "hidden"
                    )}>
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={activeConversation.avatar} />
                                    <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{activeConversation.name}</p>
                                    <p className="text-xs text-muted-foreground">Active now</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={cn("flex", { 'justify-end': msg.from === 'me', 'justify-start': msg.from === 'other' })}>
                                        <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2", { 'bg-primary text-primary-foreground': msg.from === 'me', 'bg-muted': msg.from === 'other' })}>
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t bg-background/95">
                            <div className="relative">
                                <Input placeholder="Type a message..." className="pr-20" />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <Button variant="ghost" size="icon">
                                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <SendHorizonal className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                 {!activeConversation && (
                    <div className="hidden md:flex w-2/3 flex-col items-center justify-center text-center">
                        <MessageSquare className="h-16 w-16 text-muted-foreground/50" />
                        <p className="mt-4 text-lg font-semibold">Select a conversation</p>
                        <p className="text-muted-foreground">Choose from your existing conversations to start chatting.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
