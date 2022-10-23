import { Fragment } from 'react'

import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SlotProvider, createSlot } from 'react-view-slot'

import { useAuth } from '@redwoodjs/auth'
import { Link, routes, useMatch } from '@redwoodjs/router'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { ICurrentUser } from 'src/lib/auth'

import ChefRJ from './chef-rj.png'
import LogoBlack from './sj_black.svg'

type SiteLayoutProps = {
  children?: React.ReactNode
}

interface INavigation {
  name: string
  href: string
  current: boolean
}

interface IUserNavigation {
  name: string
  onClick: () => void
}

export const HeaderSlot = createSlot('header')

const SiteLayout = ({ children }: SiteLayoutProps) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()

  const navigationNotLoggedIn: INavigation[] = [
    {
      name: 'Welcome',
      href: routes.welcome(),
      current: useMatch(routes.welcome()).match,
    },
    {
      name: 'Login',
      href: routes.login(),
      current: useMatch(routes.login()).match,
    },
  ]

  const navigationLoggedIn: INavigation[] = [
    {
      name: 'Recipes',
      href: routes.recipes(),
      current: useMatch(routes.recipes()).match,
    },
    {
      name: 'New Recipe',
      href: routes.newRecipe(),
      current: useMatch(routes.newRecipe()).match,
    },
  ]

  const userNavigation: IUserNavigation[] = [
    {
      name: 'Sign out',
      onClick: () => {
        logOut()
          .then(() => {
            toast('You have been signed out')
          })
          .catch(() => {
            toast.error('There was a problem with signing you out')
          })
      },
    },
  ]

  return (
    <>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <SlotProvider>
        <div className="min-h-screen bg-gray-100">
          <Header
            navigation={
              isAuthenticated ? navigationLoggedIn : navigationNotLoggedIn
            }
            userNavigation={userNavigation}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser as ICurrentUser | null}
          />

          <div className="py-10">
            <header>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  <HeaderSlot />
                </h1>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Replace with your content */}
                <div className="px-4 py-8 sm:px-0">{children}</div>
                {/* /End replace */}
              </div>
            </main>
          </div>
        </div>
      </SlotProvider>
    </>
  )
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface IHeaderProps {
  navigation: INavigation[]
  userNavigation: IUserNavigation[]
  isAuthenticated: boolean
  currentUser: ICurrentUser | null
}
const Header = ({
  navigation,
  userNavigation,
  isAuthenticated,
  currentUser,
}: IHeaderProps) => {
  const user = {
    name: currentUser?.username,
    imageUrl: ChefRJ,
  }

  return (
    <Disclosure as="nav" className="border-b border-gray-200 bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <Link
                  to={routes.welcome()}
                  className="flex flex-shrink-0 items-center"
                >
                  <LogoBlack className="block h-8 w-auto" />
                </Link>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              {isAuthenticated && currentUser && (
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <button
                                onClick={item.onClick}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block w-full px-4 py-2 text-left text-sm text-gray-700'
                                )}
                              >
                                {item.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              )}

              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            {/* User section */}
            {isAuthenticated && currentUser && (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {currentUser.username}
                    </div>
                    {/* <div className="text-sm font-medium text-gray-500">
                      {currentUser.email}
                    </div> */}
                  </div>
                  {/* <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="button"
                      onClick={item.onClick}
                      className="block w-full cursor-pointer px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default SiteLayout
