import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNav />
      <main className="flex-1 flex flex-col w-full pb-20 md:pb-0 relative">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
