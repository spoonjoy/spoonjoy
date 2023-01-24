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
    ? 'relative block w-full rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 h-[200px] sm:h-[270px] flex flex-center justify-center text-gray-500 hover:text-gray-700'
    : 'group relative block w-full text-center focus:outline-none focus:ring-indigo-500 text-center h-[200px] sm:h-[270px] flex flex-center justify-center'
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
    <div
      className={`relative w-full overflow-hidden rounded-lg group-focus:ring-2 group-focus:ring-indigo-700`}
    >
      <div
        style={{
          backgroundImage: `url('${recipe.imageUrl}')`,
        }}
        className={` absolute top-0 bottom-0 left-0 right-0 bg-cover bg-bottom contrast-75 saturate-[.75] group-hover:contrast-100 group-hover:saturate-100 group-focus:contrast-100 group-focus:saturate-100`}
      />

      <div className="absolute bottom-0 flex w-full justify-center">
        <div className="mx-2 w-full">
          <div className="relative mb-2 rounded-md p-4 text-white backdrop-blur backdrop-brightness-50">
            <h3 className="text-xl font-medium text-white opacity-90">
              {recipe.title}
            </h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dd className="text-sm text-white opacity-70">
                {recipe.description}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </CardBase>
)

export default function RecipeList({ recipes }: MyRecipes) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
