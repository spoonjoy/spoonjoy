export const RECIPE_SHORT_INFO = gql`
  fragment RecipeShortInfo on Recipe {
    id
    title
    description
    imageUrl
    chef {
      id
      username
    }
  }
`
