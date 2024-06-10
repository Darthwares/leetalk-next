"use client";

import Link from "next/link";
import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Loading from "./loading";
import CategoryList from "./landing/categories/categoryList";
import TestimonialCard from "./landing/testimonial/card";
import { classNames } from "@/lib/utils";
import { useRouter } from "next/navigation";
import CardView from "./cardView";

export default function Landing() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/debate" });
  };

  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  if (status === "loading") {
    return <Loading />;
  }
  return (
    <div className="w-full mx-auto">
      <header className="flex h-20 sticky top-0 z-40 border-b bg-white border-gray-300 w-full shrink-0 items-center justify-between px-4 md:px-6">
        <Link
          className="flex items-center cursor-pointer  gap-2 font-semibold max-w-fit w-full"
          href="#"
        >
          {/* <SpeechIcon className="h-6 w-6" /> */}
          <Image
            src={"/logo2.png"}
            width={25}
            height={25}
            alt="debat.ai logo"
          />
          <span>Debat.ai</span>
        </Link>
        <div className="md:flex gap-5 items-center hidden w-full justify-center ">
          {session && (
            <Link className="font-semibold" href="/my-debates">
              Listen
            </Link>
          )}
          <button className="font-semibold" onClick={handleSignIn}>
            Create
          </button>
          <Link href="/categories?query=Technology" className="font-semibold">
            Capture
          </Link>
        </div>
        <nav className="ml-auto hidden gap-4 sm:gap-6 sm:flex w-full max-w-fit">
          {!session?.user.id ? (
            <button
              className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              onClick={() => {
                if (!session?.user.id) {
                  return handleSignIn();
                }
              }}
            >
              Get Started
            </button>
          ) : (
            <>
              {session?.user.id && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={session?.user?.image ?? ""}
                          height={20}
                          width={20}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/my-debates"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Listen
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/categories?query=Technology"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Capture
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={() => {
                                return signOut();
                              }}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              )}
            </>
          )}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="sm:hidden" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="grid gap-2 py-6">
              <button
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => {
                  if (!session?.user.id) {
                    return handleSignIn();
                  }
                  return router.push("/debate");
                }}
              >
                Create
              </button>
              {status === "authenticated" && (
                <Link
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  href="/my-debates"
                >
                  Listen
                </Link>
              )}

              <Link
                className="flex w-full items-center py-2 text-lg font-semibold"
                href="/categories?query=Technology"
              >
                Capture
              </Link>
              <Button
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => {
                  if (!session?.user.id) {
                    return handleSignIn();
                  }
                  return signOut();
                }}
              >
                {session?.user.id ? "Logout" : "Login"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <CardView />
      <div className="w-full flex flex-col items-center justify-center">
        <CategoryList />
      </div>
      <section className="w-full py-12 md:pt-16">
        <div className="container px-2 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col max-w-lg justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Debate Any Topic, Anytime
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join our vibrant community and engage in thought-provoking
                  discussions on a wide range of topics. Share your
                  perspectives, challenge ideas, and expand your horizons.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <button
                  onClick={() => {
                    if (!session?.user.id) {
                      return handleSignIn();
                    }
                    return router.push("/debate");
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                >
                  Start Debate
                </button>
              </div>
            </div>
            <div className="h-[18rem] md:h-[30rem] w-full">
              <lottie-player
                src="/talking.json"
                background=""
                speed="1"
                loop
                autoplay
                className="bg-gradient-to-r from-indigo-100 to-pink-200"
              ></lottie-player>
            </div>
          </div>
        </div>
      </section>
      <TestimonialCard />

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 Debat.ai. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function SpeechIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20" />
      <path d="M19.8 17.8a7.5 7.5 0 0 0 .003-10.603" />
      <path d="M17 15a3.5 3.5 0 0 0-.025-4.975" />
    </svg>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
