"use client";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import Image from "next/image";
import TopicList from "./topicList";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryPage } from "@/constants/default";
import { classNames } from "@/lib/utils";

const navigation = [
  { name: "Usage", href: "#", icon: ChartBarSquareIcon, current: false },
  { name: "Activity", href: "#", icon: SignalIcon, current: true },
  { name: "Settings", href: "#", icon: Cog6ToothIcon, current: false },
];

const DesktopSidebar = () => {
  const pathname = usePathname();

  let pathArray = pathname === "/categories" ? categoryPage : navigation;

  return (
    <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
      <div className="flex h-16 pb-2 sticky top-0 z-20 -pr-5 bg-white/50 shrink-0 items-center">
        <Link href="/">
          <Image
            width={80}
            height={36}
            className="h-[3.5rem] w-20"
            src="/logo1.png"
            alt="Your Company"
          />
        </Link>
      </div>
      <div className="flex grow pt-5 flex-col gap-y-5 overflow-y-auto bg-gray-100 px-4 ring-1 ring-white/5">
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {pathArray.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-800 text-white"
                          : "text-gray-700 hover:text-white hover:bg-gray-800",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li className="-mx-2">
              <TopicList />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DesktopSidebar;
