
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
import { signInWithGoogle } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function SignupForm() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignUp = async () => {
    setIsSigningUp(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Redirecting...",
        description: "You are being redirected to Google to complete your sign up.",
      });
    } catch (error) {
      console.error("Google Sign-Up failed:", error);
      toast({
        variant: "destructive",
        title: "Sign-Up Failed",
        description: "Could not sign up with Google. Please try again.",
      });
       setIsSigningUp(false);
    }
  };


  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold font-headline">Create an account</CardTitle>
        <CardDescription>Sign up to start selling and buying</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isSigningUp}>
          {isSigningUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-4 w-4" />}
          {isSigningUp ? "Redirecting..." : "Sign up with Google"}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-primary">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
