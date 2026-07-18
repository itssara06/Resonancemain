import Link from "next/link";
import Image from "next/image";
import { Home, Compass, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ThemeToggle } from "@/components/theme-toggle";

export function TopNav() {
  return (
    <header className="hidden md:flex w-full h-16 border-b border-border sticky top-0 bg-background/95 backdrop-blur-xl z-50 items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-lg shadow-primary/20">
            <Image src="/logo.png" alt="Resonance Logo" width={32} height={32} className="object-cover" />
          </div>
          <span className="text-xl font-semibold tracking-tight hidden lg:inline-block">Resonance</span>
        </Link>
      </div>

      <nav className="flex items-center h-full gap-2 lg:gap-6">
        <NavItem href="/" icon={<Home size={22} />} label="Home" />
        <NavItem href="/explore" icon={<Compass size={22} />} label="Explore" />
        <NavItem href="/notifications" icon={
          <div className="relative">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border border-background">
              8
            </span>
          </div>
        } label="Notifications" />
        <div className="w-px h-8 bg-border mx-2" />
        <ThemeToggle />
        <Link href="/profile" className="flex items-center gap-2 hover:bg-secondary/50 px-3 py-1.5 rounded-lg transition-colors">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" />
            <AvatarFallback className="bg-secondary text-xs">SJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col hidden xl:flex">
             <span className="text-sm font-medium leading-tight">Me</span>
          </div>
        </Link>
      </nav>
    </header>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex flex-col items-center justify-center w-20 h-full border-b-2 transition-all duration-200 group
        ${active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
    >
      <div className={`mb-1 transition-colors ${active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
        {icon}
      </div>
      <span className={`text-[11px] font-medium hidden lg:block ${active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
        {label}
      </span>
    </Link>
  );
}
