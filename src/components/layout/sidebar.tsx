"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Compass, PlusSquare, Bell, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const handleProtectedNavigation = (e: React.MouseEvent, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push('/login');
    }
  };
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border h-screen sticky top-0 bg-background/95 backdrop-blur z-40 p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
          <Image src="/logo.png" alt="Resonance Logo" width={32} height={32} className="object-cover" />
        </div>
        <span className="text-xl font-semibold tracking-tight">Resonance</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem href="/" icon={<Home size={20} />} label="Home" active={pathname === "/"} />
        <NavItem href="/explore" icon={<Compass size={20} />} label="Explore" active={pathname === "/explore"} />
        
        {/* Hide these from guests, or use the modal intercept? The user said "Hide: Notifications, Messages, Profile, Settings" */}
        {isAuthenticated && (
          <>
            <NavItem href="/create" icon={<PlusSquare size={20} />} label="Create" active={pathname === "/create"} onClick={(e) => handleProtectedNavigation(e, "/create")} />
            <NavItem href="/notifications" icon={<Bell size={20} />} label="Notifications" active={pathname === "/notifications"} onClick={(e) => handleProtectedNavigation(e, "/notifications")} />
            <NavItem href="/profile" icon={<User size={20} />} label="Profile" active={pathname === "/profile"} onClick={(e) => handleProtectedNavigation(e, "/profile")} />
          </>
        )}
      </nav>

      <div className="mt-auto pt-4">
        {isAuthenticated ? (
          <div className="p-4 surface rounded-xl flex items-center gap-3 cursor-pointer hover:bg-foreground/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
              {/* Avatar placeholder */}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Logged In User</span>
              <span className="text-xs text-muted-foreground">Manage profile</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            <button onClick={() => router.push('/login')} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 px-4 rounded-xl transition-colors">
              Sign In
            </button>
            <button onClick={() => router.push('/login')} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium py-3 px-4 rounded-xl transition-colors">
              Create Account
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active, onClick }: { href: string; icon: React.ReactNode; label: string; active?: boolean; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group
        ${active ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
    >
      <div className={`${active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`}>
        {icon}
      </div>
      <span className="text-base">{label}</span>
    </Link>
  );
}
