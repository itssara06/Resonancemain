"use client";

import Link from "next/link";
import { Home, Compass, Bell, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const handleProtectedNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push(href);
    } else {
      router.push('/login');
    }
  };
  return (
    <nav className="md:hidden fixed bottom-0 w-full surface z-40 pb-safe border-t border-black/5 dark:border-white/5">
      <div className="flex justify-around items-center h-16 px-2">
        <NavItem href="/" icon={<Home size={24} />} active={pathname === "/"} />
        <NavItem href="/explore" icon={<Compass size={24} />} active={pathname === "/explore"} />
        
        {isAuthenticated && (
          <>
            <NavItem href="/notifications" active={pathname === "/notifications"} onClick={(e) => handleProtectedNavigation(e, "/notifications")} icon={
              <div className="relative">
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border border-background">
                  8
                </span>
              </div>
            } />
            <NavItem href="/profile" icon={<User size={24} />} active={pathname === "/profile"} onClick={(e) => handleProtectedNavigation(e, "/profile")} />
          </>
        )}
      </div>
    </nav>
  );
}

function NavItem({ href, icon, active, onClick }: { href: string; icon: React.ReactNode; active?: boolean; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center
        ${active ? 'text-primary-foreground bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <div className={`${active ? 'text-primary' : 'text-muted-foreground'} transition-colors`}>
        {icon}
      </div>
    </Link>
  );
}
