import Link from "next/link";
import { Home, Compass, PlusSquare, Bell, User } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full surface z-40 pb-safe border-t border-black/5 dark:border-white/5">
      <div className="flex justify-around items-center h-16 px-2">
        <NavItem href="/" icon={<Home size={24} />} active />
        <NavItem href="/explore" icon={<Compass size={24} />} />
        <NavItem href="/notifications" icon={
          <div className="relative">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border border-background">
              8
            </span>
          </div>
        } />
        <NavItem href="/profile" icon={<User size={24} />} />
      </div>
    </nav>
  );
}

function NavItem({ href, icon, active }: { href: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center
        ${active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <div className={`${active ? 'text-foreground' : 'text-muted-foreground'} transition-colors`}>
        {icon}
      </div>
    </Link>
  );
}
