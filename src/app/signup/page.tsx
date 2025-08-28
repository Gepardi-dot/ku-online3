import { SignupForm } from "@/components/auth/signup-form";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-foreground">
          <Icons.logo className="h-6 w-6" />
          <span className="text-lg">KU-ONLINE</span>
        </Link>
      </div>
      <SignupForm />
    </div>
  );
}
