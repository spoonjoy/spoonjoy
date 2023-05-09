import type {
  FindRecipesByUser,
  FindCookbooksByUserVariables,
} from 'types/graphql'

import { routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Recipes from 'src/components/Recipe/Recipes'
import EmptyState from 'src/components/shared/EmptyState'

import { RECIPE_SHORT_INFO } from '../recipeFragments'

export const QUERY = () => {
  return gql`
    ${RECIPE_SHORT_INFO}
    query FindRecipesByUser($username: String!) {
      recipes: usersRecipes(username: $username) {
        ...RecipeShortInfo
      }
    }
  `
}

export const Loading = () => <Recipes />

export const Empty = (props: { variables: FindCookbooksByUserVariables }) => {
  const { currentUser } = useAuth()
  const isOwner = currentUser?.username === props.variables.username
  return isOwner ? (
    <EmptyState
      header="No recipes yet"
      subHeader="Get started by creating a new recipe."
      ctaRoute={routes.newRecipe()}
      cta="New Recipe"
      withPlusIcon
      isOwner
    />
  ) : (
    <EmptyState
      header="No recipes yet"
      subHeader={`${props.variables.username} hasn't created any recipes yet.`}
    />
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  recipes,

  queryResult: {
    variables,
  },
}: CellSuccessProps<FindRecipesByUser, FindCookbooksByUserVariables>) => {
  const { currentUser } = useAuth()
  return (
    <Recipes
      recipes={recipes}
      withAddRecipeButton={currentUser?.username === variables?.username}
    />
  )
}
