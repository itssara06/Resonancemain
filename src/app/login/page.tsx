"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [dob, setDob] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      router.push("/");
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 pb-20 md:pb-0 relative overflow-hidden bg-background">
      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8 sm:mb-10 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-xl sm:text-2xl leading-none">R</span>
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
                  <Input type="email" placeholder="name@example.com" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Date of Birth</label>
                  <Input 
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={dob}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                      if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);
                      setDob(val);
                    }}
                    maxLength={10}
                    className="bg-black/20 border-white/10 h-12 rounded-xl text-white placeholder-muted-foreground"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Confirm Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
                </div>
              </>
            )}
            
            {isLogin && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Email</label>
                  <Input type="email" placeholder="name@example.com" defaultValue="dummy@example.com" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground pl-1">Password</label>
                  <Input type="password" placeholder="••••••••" defaultValue="password123" className="bg-black/20 border-white/10 h-12 rounded-xl" required />
                </div>
              </>
            )}

            <Button type="submit" className="w-full h-12 mt-4 rounded-xl text-base font-medium">
              {isLogin ? "Sign In" : "Create Account"}
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
    </div>
  );
}
