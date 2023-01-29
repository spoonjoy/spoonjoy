import type { MyRecipes, ExampleRecipes } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Recipes from 'src/components/Recipe/Recipes'

import { RECIPE_SHORT_INFO } from '../recipeFragments'
import NoRecipes from '../Recipes/NoRecipes'

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
    <NoRecipes />
    // <div className="rw-text-center">
    //   {'No recipes yet. '}
    //   <Link to={routes.newRecipe()} className="rw-link">
    //     {'Create one?'}
    //   </Link>
    // </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recipes,
}: CellSuccessProps<MyRecipes | ExampleRecipes>) => {
  return <Recipes recipes={recipes} />
}
