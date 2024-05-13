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
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Header from "@/components/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});


export function classNames(...classes:string[]) {
  return classes.filter(Boolean).join(' ');
}
export default function RootLayout({ children, params }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen w-full bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <SessionWrapper>
          <RecoilRoot>
            <Container>
              <div className="w-full max-w-7xl xl:max-w-[90rem] mx-auto">
                {pathname !== '/' && (
                  <>
                    <MobileViewSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />
                    <DesktopSidebar />
                    <div className="xl:pl-72">
                      <Header setSidebarOpen={setSidebarOpen} />
                      {children}
                    </div>
                  </>
                )}
                {pathname === '/' && <Landing />}
              </div>
            </Container>
          </RecoilRoot>
        </SessionWrapper>
      </body>
    </html>
  );
}
