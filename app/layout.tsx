"use client";

import "@/app/globals.css";
import { Quicksand as FontSans } from "next/font/google";
import { RecoilRoot, useRecoilState } from "recoil";
import { cn } from "@/lib/utils";
import DesktopSidebar from "@/components/desktopSidebar";
import { Suspense, useState } from "react";
import MobileViewSidebar from "@/components/mobileViewSidebar";
import SessionWrapper from "@/components/SessionWrapper";
import Landing from "@/components/landing";
import { usePathname } from "next/navigation";
import Container from "@/components/container";
import Header from "@/components/header";
import Loading from "@/components/loading";
import { Toaster } from "@/components/ui/toaster";
import {
  messagesState,
  showAudioPlayingState,
  showCurrentPlayingURL,
  singleTopicState,
} from "@/state/state";
import AudioPlayer from "@/components/audioPlayer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const LayoutWithPlayer = ({ children }: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topic] = useRecoilState(singleTopicState);
  const [messageList] = useRecoilState(messagesState);
  const [audio] = useRecoilState(showCurrentPlayingURL);
  const [showAudioPlayer] = useRecoilState(showAudioPlayingState);
  const pathname = usePathname();

  return (
    <>
      <div className="w-full max-w-7xl xl:max-w-[90rem] mx-auto">
        {pathname !== "/" && (
          <>
            <Suspense fallback={<Loading />}>
              <MobileViewSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <DesktopSidebar />
            </Suspense>
            <div className="xl:pl-72">
              <Header setSidebarOpen={setSidebarOpen} />
              {children}
            </div>
          </>
        )}
        {pathname === "/" && <Landing />}
      </div>
      <Toaster />
      {showAudioPlayer && (
        <div className="fixed w-full bottom-0 sm:bottom-0 z-[51]">
          <AudioPlayer topic={topic} audioURL={audio} messages={messageList!} />
        </div>
      )}
    </>
  );
};

export default function RootLayout({ children, params }: any) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen w-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionWrapper>
          <RecoilRoot>
            <Container>
              <LayoutWithPlayer>{children}</LayoutWithPlayer>
            </Container>
          </RecoilRoot>
        </SessionWrapper>
      </body>
    </html>
  );
}
