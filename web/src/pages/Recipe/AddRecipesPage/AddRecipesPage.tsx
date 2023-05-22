import {
  ArrowDownOnSquareStackIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/solid'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { classNames } from 'src/helpers/css'
import {
  HeaderSlot,
  ProminentBrandedHeader,
} from 'src/layouts/SiteLayout/SiteLayout'

const actions = [
  {
    title: 'use form',
    subTitle: 'use the spoonjoy recipe builder to manually input a recipe',
    href: routes.newRecipe(),
    icon: ClipboardDocumentListIcon,
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
  },
  {
    title: 'import',
    subTitle: 'spoonjoy can import from any website and some platforms',
    href: routes.importRecipes(),
    icon: ArrowDownOnSquareStackIcon,
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-50',
  },
]

const AddRecipesPage = () => {
  return (
    <>
      <MetaTags title="add recipes" description="Add recipes to Spoonjoy" />
      <HeaderSlot.Plug id="add-recipes">
        <ProminentBrandedHeader actionTitle="add recipes to" />
      </HeaderSlot.Plug>
      <div className="m-auto mt-3 max-w-3xl rounded-lg sm:mt-20 sm:bg-gray-200 sm:p-8">
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
          {actions.map((action, actionIdx) => (
            <div
              key={action.title}
              className={classNames(
                actionIdx === 0
                  ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none'
                  : '',
                actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
                actionIdx === actions.length - 1
                  ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
                  : '',
                'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
              )}
            >
              <div>
                <span
                  className={classNames(
                    action.iconBackground,
                    action.iconForeground,
                    'inline-flex rounded-lg p-3 ring-4 ring-white'
                  )}
                >
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  <Link to={action.href} className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500">{action.subTitle}</p>
              </div>
              <span
                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default AddRecipesPage
