import type { MyRecipes, ExampleRecipes } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Recipes from 'src/components/Recipe/Recipes'

import NoRecipes from '../Recipes/NoRecipes'

export const QUERY = (props: any) => {
  const isExampleRecipe = !!props.variables.exampleRecipes
  if (isExampleRecipe) {
    return gql`
      query ExampleRecipes {
        recipes: usersRecipes(username: "ari") {
          id
          title
          description
        }
      }
    `
  } else {
    return gql`
      query MyRecipes {
        recipes: myRecipes {
          id
          title
          description
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
