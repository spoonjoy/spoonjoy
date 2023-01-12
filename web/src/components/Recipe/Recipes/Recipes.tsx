import { PlusIcon } from '@heroicons/react/20/solid'
import type { MyRecipes } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

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
  const containerClass = emptyState
    ? 'relative block w-full rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[130px] flex flex-center justify-center text-gray-500 hover:text-gray-700'
    : 'relative block w-full rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-gray-300 text-center hover:border-gray-400 bg-white min-h-[130px] flex flex-center justify-center text-gray-500 hover:text-gray-700'
  return (
    <li>
      <Link className={containerClass} to={linkTo} title={linkTitle}>
        {children}
      </Link>
    </li>
  )
}

const RecipeCard = ({ recipe }: { recipe: Unpacked<MyRecipes['recipes']> }) => (
  <CardBase
    linkTo={routes.recipe({ id: recipe.id })}
    linkTitle={'Show recipe ' + recipe.id + ' detail'}
  >
    <div className="flex flex-col justify-center align-baseline">
      <div>
        <h3 className="text-xl font-medium text-gray-900">{recipe.title}</h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="sr-only">Title</dt>
          <dd className="text-sm text-gray-500">{recipe.description}</dd>
        </dl>
      </div>
    </div>
  </CardBase>
)

export default function RecipeList({ recipes }: MyRecipes) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
      <CardBase
        emptyState
        linkTo={routes.newRecipe()}
        linkTitle="Create a new recipe"
      >
        <div className="inline-flex items-center">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add new recipe!
        </div>
      </CardBase>
    </ul>
  )
}
