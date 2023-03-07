import { PlusIcon } from '@heroicons/react/20/solid'
import type { RecipeShortInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import useMyCookbooksQuery from 'src/components/Cookbook/useMyCookbooksQuery'
import RecipeCard from 'src/components/Recipe/Recipes/RecipeCard'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'

interface IRecipesProps {
  recipes?: RecipeShortInfo[]
  withAddRecipeButton?: boolean
}

const Recipes = ({ recipes, withAddRecipeButton = false }: IRecipesProps) => {
  const { currentUser } = useAuth()

  const {
    data: myCookbooks,
    loading,
    error,
  } = useMyCookbooksQuery(currentUser?.username)
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* when loading, withMyCookbooksQuery will pass in an empty array (because undefined/null imply that it doesn't exist) */}
      {recipes && !loading ? (
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            myCookbooks={myCookbooks}
          />
        ))
      ) : (
        <RecipeCard />
      )}
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

export default Recipes
