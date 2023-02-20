import type { FindRecipeById, FindRecipeByIdVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Recipe from 'src/components/Recipe/RecipeComponent/Recipe'

import { RECIPE_SHORT_INFO } from '../recipeFragments'
import Recipes from '../Recipes'

interface IRecipeCellExtraProps {
  shortRecipe?: boolean
}

export const QUERY = (props: {
  variables: FindRecipeByIdVariables & IRecipeCellExtraProps
}) => {
  if (props.variables.shortRecipe) {
    return gql`
      ${RECIPE_SHORT_INFO}
      query FindShortRecipeById($id: String!) {
        recipe: recipe(id: $id) {
          ...RecipeShortInfo
        }
      }
    `
  }
  return gql`
    query FindRecipeById($id: String!) {
      recipe: recipe(id: $id) {
        id
        title
        description
        imageUrl
        servings
        chef {
          id
          username
        }
        steps {
          id
          stepNum
          stepTitle
          description
          ingredients {
            id
            quantity
            ingredientRef {
              id
              name
            }
            unit {
              id
              name
            }
          }
          stepOutputUses {
            id
            outputOfStep {
              id
              stepNum
            }
          }
        }
        createdAt
        deletedAt
        inMyCookbooks {
          cookbookId
        }
      }
    }
  `
}

export const Loading = ({ shortRecipe = false }: IRecipeCellExtraProps) => {
  switch (shortRecipe) {
    case true:
      return <Recipes withAddRecipeButton />
    default:
      return <Recipe recipe={undefined} />
  }
}

export const Empty = () => <div>Recipe not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recipe,
  shortRecipe = false,
}: CellSuccessProps<FindRecipeById> & IRecipeCellExtraProps) => {
  switch (shortRecipe) {
    case true:
      return <Recipes recipes={[recipe]} withAddRecipeButton />
    default:
      return <Recipe recipe={recipe} />
  }
}
