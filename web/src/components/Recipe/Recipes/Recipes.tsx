import type { FindMyRecipes } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

const RecipeCard = ({
  recipe,
}: {
  recipe: Unpacked<FindMyRecipes['recipes']>
}) => (
  <li className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
    <Link
      to={routes.recipe({ id: recipe.id })}
      title={'Show recipe ' + recipe.id + ' detail'}
    >
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-xl font-medium text-gray-900">
          {recipe.title}
        </h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="sr-only">Title</dt>
          <dd className="text-sm text-gray-500">{recipe.description}</dd>
        </dl>
      </div>
    </Link>
  </li>
)

export default function RecipeList({ recipes }: FindMyRecipes) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </ul>
  )
}
