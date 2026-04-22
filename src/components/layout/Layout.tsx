import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:pl-25.75">
      <Sidebar />
      <main className="mx-auto w-full max-w-4xl px-6 md:px-10 py-8 md:py-16">
        {children}
      </main>
    </div>
  );
}
