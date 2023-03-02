import { PlusIcon } from '@heroicons/react/20/solid'
import type { MyCookbooksQuery, RecipeShortInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import withMyCookbooksQuery from 'src/components/Cookbook/withMyCookbooksQuery/withMyCookbooksQuery'
import RecipeCard from 'src/components/Recipe/Recipes/RecipeCard'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'

interface IRecipesProps {
  recipes?: RecipeShortInfo[]
  withAddRecipeButton?: boolean
  myCookbooks?: MyCookbooksQuery['myCookbooks']
}

const Recipes = ({
  recipes,
  withAddRecipeButton = false,
  myCookbooks,
}: IRecipesProps) => {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes ? (
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

const RecipesWithMyCookbooksQuery = (props: IRecipesProps) => {
  const { currentUser } = useAuth()
  const Component = withMyCookbooksQuery(Recipes, currentUser?.username)
  return <Component {...props} />
}

export default RecipesWithMyCookbooksQuery
