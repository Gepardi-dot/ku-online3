
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      router.push("/");
      toast({
        title: "Signed In",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      toast({
        variant: "destructive",
        title: "Sign-In Failed",
        description: "Could not sign in with Google. Please try again.",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold font-headline">Login</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSigningIn}>
          {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-4 w-4" />}
          {isSigningIn ? "Signing in..." : "Sign in with Google"}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
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
