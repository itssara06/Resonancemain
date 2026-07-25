"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { signIn } from "@/lib/auth-client";

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setLocalError(null);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: nextPath,
      });
      // The page will redirect to Google immediately.
    } catch (err: any) {
      setLocalError("Failed to initialize Google login. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      if (isLogin) {
        await login({ email, password });
        router.push(nextPath);
      } else {
        await register({ email, password, username, displayName });
        router.push(nextPath);
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

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#09090b] px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || loading}
            className="w-full h-12 rounded-xl text-base font-medium bg-black/20 border-white/10"
          >
            {isGoogleLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </>
            )}
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
