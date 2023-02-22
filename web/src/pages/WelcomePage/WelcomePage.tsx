import { Fragment } from 'react'

import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import LogoBlack from 'public/logos/sj_black.svg'

import { Link, Redirect, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Loading from 'src/components/Loading/Loading'

// import WelcomeHeaderImg from './sj-welcome-header.jpg'

const WelcomePage = () => {
  const { currentUser, loading } = useAuth()
  if (loading) {
    return <Loading />
  }
  if (currentUser) {
    return <Redirect to={routes.user({ username: currentUser.username })} />
  } else {
    const navigation = [
      { name: 'sign up', href: routes.signup() },
      { name: 'log in', href: routes.login() },
    ]

    // Change the number here to the number of images in the welcome_images folder
    const welcomeImageNumber = Math.floor(Math.random() * 9) + 1

    // window width rounded to the nearest 100 pixels
    const welcomeImageWidth = Math.ceil(window.innerWidth / 100) * 100

    return (
      <>
        <MetaTags
          title="welcome to spoonjoy"
          description="spoonjoy welcome page"
        />
        <div className="relative h-screen overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl lg:h-full">
            <div className="relative z-10 h-full bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
              <svg
                className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>

              <Popover>
                <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
                  <nav
                    className="relative flex items-center justify-between sm:h-10 lg:justify-start"
                    aria-label="Global"
                  >
                    <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
                      <div className="flex w-full items-center justify-between md:w-auto">
                        <a href={routes.welcome()}>
                          <span className="sr-only">Spoonjoy</span>
                          <LogoBlack className="h-8 w-auto sm:h-10" />
                        </a>
                        <div className="-mr-2 flex items-center md:hidden">
                          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:ml-10 md:block md:space-x-8 md:pr-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="font-medium text-gray-500 hover:text-gray-900"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>

                <Transition
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-100 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel
                    focus
                    className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
                  >
                    <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
                      <div className="flex items-center justify-between px-5 pt-4">
                        <div>
                          <LogoBlack className="h-8 w-auto" />
                        </div>
                        <div className="-mr-2">
                          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close main menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </Popover.Button>
                        </div>
                      </div>
                      <div className="space-y-1 px-2 pt-2 pb-3">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>

              <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">home cooking,</span>
                    <span className="block text-indigo-600">made easy</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                    spoonjoy is the easiest way to save, follow, and share
                    recipes.
                    {/* we also make it effortless to create grocery lists
                    using your recipes as starting points (coming soon). */}
                  </p>
                  <div className="mt-5 sm:mx-auto sm:mt-8 sm:flex sm:w-80 sm:flex-col lg:mx-0">
                    <div className="sm:flex">
                      <div className="rounded-md shadow sm:w-1/2">
                        <Link
                          to={routes.signup()}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                        >
                          sign up
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3 sm:w-1/2">
                        <Link
                          to={routes.login()}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 md:py-4 md:px-10 md:text-lg"
                        >
                          log in
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link
                        to={routes.user({ username: 'ari' })}
                        className="flex w-full items-center justify-center rounded-md border-2 border-indigo-700 bg-white px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 md:py-4 md:px-10 md:text-lg"
                      >
                        view example pantry
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="absolute bottom-0 top-[30rem] left-0 right-0 lg:inset-y-0 lg:left-1/2 lg:w-1/2">
            <img
              className="h-full w-full object-cover"
              src={`https://res.cloudinary.com/dpjmyc4uz/image/upload/w_${welcomeImageWidth},f_auto/welcome_images/sjwelcome_${welcomeImageNumber}`}
              alt="Home cooking, made easy"
            />
          </div>
        </div>
      </>
    )
  }
}

export default WelcomePage
