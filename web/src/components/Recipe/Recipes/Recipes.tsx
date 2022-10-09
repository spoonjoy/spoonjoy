import type { FindMyRecipes } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { PlusIcon } from '@heroicons/react/20/solid'

interface CardBaseProps {
  children: JSX.Element
  linkTo: string
  linkTitle: string
  emptyState?: boolean
}
const CardBase = ({
  children,
  linkTo,
  linkTitle,
  emptyState = false,
}: CardBaseProps) => {
  const containerClass = emptyState ? "relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-5 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2": "col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
  return (
    <li className={containerClass}>
      <Link className='w-full' to={linkTo} title={linkTitle}>
        <div className="flex flex-1 flex-col p-8">{children}</div>
      </Link>
    </li>
  )
}

const RecipeCard = ({
  recipe,
}: {
  recipe: Unpacked<FindMyRecipes['recipes']>
}) => (
  <CardBase
    linkTo={routes.recipe({ id: recipe.id })}
    linkTitle={'Show recipe ' + recipe.id + ' detail'}
  >
    <div>
      <h3 className="text-xl font-medium text-gray-900">{recipe.title}</h3>
      <dl className="mt-1 flex flex-grow flex-col justify-between">
        <dt className="sr-only">Title</dt>
        <dd className="text-sm text-gray-500">{recipe.description}</dd>
      </dl>
    </div>
  </CardBase>
)

export default function RecipeList({ recipes }: FindMyRecipes) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
      <CardBase emptyState linkTo={routes.newRecipe()} linkTitle="Create a new recipe">
        <div className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add new recipe!
        </div>
      </CardBase>
    </ul>
  )
}
