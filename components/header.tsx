"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { classNames } from "@/lib/utils";
import {
  debateCategoryState,
  loaderState,
  messagesState,
  showTopicState,
} from "@/state/state";
import { useSetRecoilState } from "recoil";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const setInputValue = useSetRecoilState(showTopicState);
  const setMessagesList = useSetRecoilState(messagesState);
  const setSelectedCategory = useSetRecoilState(debateCategoryState);
  const setLoader = useSetRecoilState(loaderState);
  const pathname = usePathname()

  const handleSignIn = async () => {
    if (status === "authenticated") {
      router.push("/debate");
    } else {
      await signIn("google", { callbackUrl: "/debate" });
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const resetStates = () => {
    setMessagesList([]);
    setSelectedCategory(null);
    setLoader(false);
    setInputValue("");
  };

  const menuItems = [
    { href: "/my-debates", label: "My Debates", onClick: resetStates },
    {
      href: "/categories?query=Technology",
      label: "Categories",
      onClick: resetStates,
    },
    { onClick: handleSignOut, label: "Sign out" },
  ];

  return (
    <Disclosure as="nav" className="sticky top-0 z-40 bg-white w-full mx-auto max-w-7xl">
      {() => (
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between w-full">
            <div className="absolute inset-y-0 left-0 flex items-center xl:hidden gap-2">
              {/* <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              </button> */}
              <div className="flex h-16 z-20 -pr-5 shrink-0 items-center">
                <Link
                  href="/"
                  onClick={() => {
                    setMessagesList([]);
                    setSelectedCategory(null);
                    setInputValue("");
                    setLoader(false);
                  }}
                  className="flex items-center cursor-pointer gap-2 font-semibold"
                >
                  <Image
                    src={"/logo2.png"}
                    width={25}
                    height={25}
                    alt="debat.ai logo"
                  />
                  <span>Debat.ai</span>
                </Link>
              </div>
            </div>
            {pathname === "/debate" && (
              <div className="xl:flex hidden h-16 z-20 -pr-5 relative top-1 shrink-0 items-center">
                <Link
                  href="/"
                  onClick={() => {
                    setMessagesList([]);
                    setSelectedCategory(null);
                    setInputValue("");
                    setLoader(false);
                  }}
                  className="flex items-center cursor-pointer gap-2 font-semibold"
                >
                  <Image
                    src={"/logo2.png"}
                    width={25}
                    height={25}
                    alt="debat.ai logo"
                  />
                  <span>Debat.ai</span>
                </Link>
              </div>
            )}

            <div className="md:flex gap-5 items-center hidden w-full justify-center">
              {session && (
                <Link className="font-semibold" href="/my-debates">
                  Listen
                </Link>
              )}
              <button className="font-semibold" onClick={handleSignIn}>
                Create
              </button>
              <Link
                className="font-semibold"
                href="/categories?query=Technology"
              >
                Capture
              </Link>
            </div>

            {session?.user?.id && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto ">
                <Menu as="div" className="relative ml- flex items-center gap-4">
                  <Link
                    className="font-semibold lg:px-3 lg:py-1.5 lg:border lg:border-gray-200 lg:hover:shadow-md lg:rounded-md"
                    href="/search"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-500 lg:hidden block" />
                    <span className="hidden lg:block">Search</span>
                  </Link>
                  <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 w-8">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 bg-gray-300 rounded-full"
                      src={session?.user?.image ?? ""}
                      alt={session?.user?.name!}
                    />
                  </Menu.Button>

                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {menuItems.map((item, index) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <Link
                              href={item.href ?? "#"}
                              onClick={item.onClick}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              {item.label}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}

            {!session && status !== "loading" && (
              <button
                className="bg-white text-black px-3.5 py-1.5 rounded-md hover:bg-gray-200 font-medium mr-3 lg:mr-0"
                onClick={() => signIn()}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </Disclosure>
  );
};

export default Header;
