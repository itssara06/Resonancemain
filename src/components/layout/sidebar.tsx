import Link from "next/link";
import Image from "next/image";
import { Home, Compass, PlusSquare, Bell, User } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border h-screen sticky top-0 bg-background/95 backdrop-blur z-40 p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
          <Image src="/logo.png" alt="Resonance Logo" width={32} height={32} className="object-cover" />
        </div>
        <span className="text-xl font-semibold tracking-tight">Resonance</span>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem href="/" icon={<Home size={20} />} label="Home" active />
        <NavItem href="/explore" icon={<Compass size={20} />} label="Explore" />
        <NavItem href="/create" icon={<PlusSquare size={20} />} label="Create" />
        <NavItem href="/notifications" icon={<Bell size={20} />} label="Notifications" />
        <NavItem href="/profile" icon={<User size={20} />} label="Profile" />
      </nav>

      <div className="mt-auto p-4 surface rounded-xl flex items-center gap-3 cursor-pointer hover:bg-foreground/10 transition-colors">
        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
          {/* Avatar placeholder */}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Guest User</span>
          <span className="text-xs text-muted-foreground">Sign in</span>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href}
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
