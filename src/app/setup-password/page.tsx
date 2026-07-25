"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";

export default function SetupPasswordPage() {
  const router = useRouter();
  const { fetchCurrentUser, loading, isAuthenticated } = useAuthStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If not authenticated at all, let AuthGuard kick them out, or we can handle it here:
  if (!loading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/user/setup-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ password })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to setup password");
      }

      // Re-fetch user to update hasPassword status
      await fetchCurrentUser();
      router.push('/feed');
    } catch (err: any) {
      setLocalError(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 pb-20 md:pb-0 relative overflow-hidden bg-background">
      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8 sm:mb-10 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-primary/20">
            <Image src="/logo.png" alt="Resonance Logo" width={48} height={48} className="object-cover" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
            Secure your account
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm px-4">
            Since you logged in with Google, you need to set up a local password to fully secure your account.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">New Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="bg-black/20 border-white/10 h-12 rounded-xl text-white" 
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Confirm Password</label>
              <Input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
                className="bg-black/20 border-white/10 h-12 rounded-xl text-white" 
                required 
              />
            </div>

            {localError && (
              <div className="text-red-500 text-sm mt-2 text-center">{localError}</div>
            )}

            <Button type="submit" disabled={isSubmitting || loading} className="w-full h-12 mt-4 rounded-xl text-base font-medium">
              {isSubmitting ? "Saving..." : "Save Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
