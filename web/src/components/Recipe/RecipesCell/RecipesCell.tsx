import type { MyRecipes, ExampleRecipes } from 'types/graphql'

import { routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Recipes from 'src/components/Recipe/Recipes'
import EmptyState from 'src/components/shared/EmptyState'

import { RECIPE_SHORT_INFO } from '../recipeFragments'

export const QUERY = (props: any) => {
  const isExampleRecipe = !!props.variables.exampleRecipes
  if (isExampleRecipe) {
    return gql`
      ${RECIPE_SHORT_INFO}
      query ExampleRecipes {
        recipes: usersRecipes(username: "ari") {
          ...RecipeShortInfo
        }
      }
    `
  } else {
    return gql`
      ${RECIPE_SHORT_INFO}
      query MyRecipes {
        recipes: myRecipes {
          ...RecipeShortInfo
        }
      }
    `
  }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <EmptyState
      header="No recipes yet"
      subHeader="Get started by creating a new recipe."
      ctaRoute={routes.newRecipe()}
      cta="New Recipe"
      withPlusIcon
    />
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recipes,
}: CellSuccessProps<MyRecipes | ExampleRecipes>) => {
  return <Recipes recipes={recipes} withAddRecipeButton />
}
