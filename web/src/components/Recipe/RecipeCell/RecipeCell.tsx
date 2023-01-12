import type { FindRecipeById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Recipe from 'src/components/Recipe/RecipeComponent/Recipe'

export const QUERY = gql`
  query FindRecipeById($id: String!) {
    recipe: recipe(id: $id) {
      id
      title
      description
      # imageUrl
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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Recipe not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ recipe }: CellSuccessProps<FindRecipeById>) => {
  return <Recipe recipe={recipe} />
}
