
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Icons } from "@/components/icons";

export function LoginForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold font-headline">Login</CardTitle>
        <CardDescription>Enter your phone number below to login to your account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="w-full">
          <Icons.google className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="+964 123 456 7890" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Login</Button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline hover:text-primary">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
