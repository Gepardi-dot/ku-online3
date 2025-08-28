import { LoginForm } from "@/components/auth/login-form";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-12 left-4">
        <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-primary">
          <Icons.logo className="h-8 w-8" />
          <span className="text-lg font-bold">KU-ONLINE</span>
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
