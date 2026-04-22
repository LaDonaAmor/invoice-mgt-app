import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:pl-[103px]">
      <Sidebar />
      <main className="mx-auto w-full max-w-3xl px-6 md:px-10 py-8 md:py-16">
        {children}
      </main>
    </div>
  );
}
