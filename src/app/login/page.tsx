"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, register, loading, error } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      if (isLogin) {
        await login({ email, password });
        router.push(nextPath);
      } else {
        await register({ email, password, username, displayName });
        setIsLogin(true);
        // Clear the password field so they can type it to sign in
        setPassword("");
        alert("Account created successfully! Please sign in.");
      }
    } catch (err: any) {
      setLocalError(err.message || "An error occurred");
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md relative z-10">
      <div className="flex flex-col items-center mb-8 sm:mb-10 text-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-primary/20">
          <Image src="/logo.png" alt="Resonance Logo" width={48} height={48} className="object-cover" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
          {isLogin ? "Welcome back" : "Join Resonance"}
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm px-4">
          {isLogin 
            ? "Enter your details to access your creative feed." 
            : "A place for designers to share ideas and creative process."}
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl ring-1 ring-white/5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Username</label>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="johndoe" className="bg-black/20 border-white/10 h-12 rounded-xl text-white placeholder-muted-foreground" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Display Name</label>
                <Input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="John Doe" className="bg-black/20 border-white/10 h-12 rounded-xl text-white placeholder-muted-foreground" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
              </div>
            </>
          )}
          
          {isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
              </div>
            </>
          )}

          {(error || localError) && (
            <div className="text-red-500 text-sm mt-2 text-center">{localError || error}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full h-12 mt-4 rounded-xl text-base font-medium">
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
          
          <div className="text-center text-xs text-muted-foreground mt-2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-foreground font-medium hover:underline transition-all"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 pb-20 md:pb-0 relative overflow-hidden bg-background">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
