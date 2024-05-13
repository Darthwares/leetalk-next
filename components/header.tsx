'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import { classNames } from '@/app/layout';
import Loading from './loading';

interface HeaderProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}
const Header = ({ setSidebarOpen }: HeaderProps) => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
      return <Loading /> 
    }
    
    return (
      <>
        <Disclosure as="nav" className="bg-gray-900 sticky top-0 z-40">
          {() => (
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <div className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5 text-white xl:hidden"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <span className="sr-only">Open sidebar</span>
                      <Bars3Icon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"></div>
                {session?.user.id && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={
                              session?.user?.image ?? ''
                            }
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
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={() => {
                                  return signOut();
                                }}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                )}
              </div>
            </div>
          )}
        </Disclosure>
      </>
    );
};

export default Header;
