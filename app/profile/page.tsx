"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LogOut, User as UserIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        Loading profile...
      </div>
    );
  }

  if (!user) return null; // Redirecting...

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex items-center gap-4 pb-6 border-b border-zinc-900">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            My Profile
          </h1>
        </header>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-indigo-600/20 p-4 rounded-full">
              <UserIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl">{user.email}</CardTitle>
              <CardDescription>Account Settings</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-zinc-400">User ID</h3>
              <p className="text-xs font-mono text-zinc-500 bg-zinc-950 p-2 rounded border border-zinc-900">
                {user.id}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-zinc-400">
                Last Signed In
              </h3>
              <p className="text-sm text-zinc-300">
                {new Date(user.last_sign_in_at!).toLocaleString()}
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-800">
              <Button
                variant="destructive"
                onClick={signOut}
                className="w-full sm:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
