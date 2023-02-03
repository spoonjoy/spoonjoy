import { PlusIcon } from '@heroicons/react/20/solid'
import type { RecipeShortInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import RecipeCard from 'src/components/Recipe/Recipes/RecipeCard'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'

interface IRecipesProps {
  recipes: RecipeShortInfo[]
  withAddRecipeButton?: boolean
}

export default function Recipes({
  recipes,
  withAddRecipeButton = false,
}: IRecipesProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
      {withAddRecipeButton && (
        <ListCardBase
          emptyState
          linkTo={routes.newRecipe()}
          linkTitle="Create a new recipe"
        >
          <div className="inline-flex items-center">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            add new recipe!
          </div>
        </ListCardBase>
      )}
    </ul>
  )
}
