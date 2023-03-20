import {
  UserIcon,
  PlusIcon,
  ArchiveBoxArrowDownIcon,
  FolderPlusIcon,
} from '@heroicons/react/24/solid'
import LogoWhite from 'public/logos/sj_white.svg'

import { Link, routes, useMatch } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const FloatingNav = () => {
  const { currentUser } = useAuth()

  const leftNav = [
    {
      name: 'recipe',
      href: routes.newRecipe(),
      current: useMatch(routes.newRecipe()).match,
      icon: PlusIcon,
    },
    {
      name: 'import',
      href: routes.importRecipes(),
      current: useMatch(routes.importRecipes()).match,
      icon: ArchiveBoxArrowDownIcon,
    },
  ]
  const rightNav = [
    {
      name: 'cookbook',
      href: routes.user({
        username: (currentUser?.username as string) || '',
        page: 'cookbooks',
        newCookbook: true,
      }),
      current: false, // This is on the user pantry page, so that'll be the current page
      icon: FolderPlusIcon,
    },
    {
      name: 'pantry',
      href: routes.user({
        username: (currentUser?.username as string) || '',
        page: 'cookbooks',
        newCookbook: false,
      }),
      current: useMatch(
        routes.user({ username: (currentUser?.username as string) || '' })
      ).match,
      icon: UserIcon,
    },
  ]
  /**
   * sizing here is as follows:
   * radial gradients are (circleDiameter + desiredSpacing) / 2
   * negative margins on side things are circleDiameter / 2
   * */
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mb-[max(1.5rem,env(safe-area-inset-bottom))] sm:hidden">
      <div className="m-auto flex h-12 w-[95%] text-white">
        <div
          style={{
            background: `radial-gradient(circle 2.25rem at center right, #0000 98%, rgb(0 0 0 / 0.6)) center right`,
          }}
          className="flex-grow-1 my-2 -mr-[2rem] h-full w-full rounded-l-full border-l-2 border-white opacity-80"
        >
          <ul className="flex h-full w-full justify-around pr-[2.5rem] pl-[1rem]">
            {leftNav.map((navItem) => (
              <li key={navItem.name}>
                <Link
                  className="flex h-full flex-col justify-center hover:text-gray-300"
                  to={navItem.href}
                >
                  <navItem.icon className="mx-auto h-5 w-5" />
                  <span className="text-xs font-light">{navItem.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link
          to={routes.user({
            username: (currentUser?.username as string) || '',
            page: 'cookbooks',
            newCookbook: false,
          })}
          className="z-10 flex h-[4rem] w-[4rem] flex-shrink-0 flex-col items-center justify-center rounded-full bg-black/70 shadow-md ring-indigo-700 ring-offset-2 backdrop-blur hover:bg-black/90 focus:ring-2"
        >
          <LogoWhite className="h-8 w-8" />
        </Link>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle 2.25rem at center left, #0000 98%, rgb(0 0 0 / 0.6)) center left`,
          }}
          className="flex-grow-1 relative my-2 -ml-[2rem] h-full w-full rounded-r-full opacity-80"
        >
          <ul className="flex h-full w-full justify-around border-l-2 border-white pl-[2.5rem] pr-[1rem]">
            {rightNav.map((navItem) => (
              <li key={navItem.name}>
                <Link
                  className="flex h-full flex-col justify-center hover:text-gray-300"
                  to={navItem.href}
                >
                  <navItem.icon className="mx-auto h-5 w-5" />
                  <span className="text-xs font-light">{navItem.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute top-2 -bottom-2 -z-10 w-[95%] rounded-full backdrop-blur" />
      </div>
    </nav>
  )
}

export default FloatingNav
