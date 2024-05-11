"use client";
import "@/app/globals.css";
import { Quicksand as FontSans } from "next/font/google";
import { RecoilRoot } from "recoil";
import { cn } from "@/lib/utils";
import DesktopSidebar from "@/components/desktopSidebar";
import { useState } from "react";
import MobileViewSidebar from "@/components/mobileViewSidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SessionWrapper from "@/components/SessionWrapper";
import Landing from "@/components/landing";
import { usePathname } from "next/navigation";
import Container from "@/components/container";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export default function RootLayout({ children, params }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionWrapper>
          <RecoilRoot>
            <Container>
              <div className="w-full mx-auto">
                {pathname !== "/" && (
                  <>
                    <MobileViewSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />
                    <DesktopSidebar />
                    <div className="xl:pl-72">
                      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5 text-white xl:hidden"
                          onClick={() => setSidebarOpen(true)}
                        >
                          <span className="sr-only">Open sidebar</span>
                          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                      {children}
                    </div>
                  </>
                )}
                {pathname === "/" && <Landing />}
              </div>
            </Container>
          </RecoilRoot>
        </SessionWrapper>
      </body>
    </html>
  );
}
