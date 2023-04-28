import { useLazyQuery, ApolloError } from '@apollo/client'
import { IngredientParseQuery } from 'types/graphql'

const INGREDIENT_PARSE_QUERY = gql`
  query IngredientParseQuery($input: String!) {
    parseIngredient(input: $input) {
      quantity
      unitName
      ingredientName
    }
  }
`

export const useIngredientParseQuery = (
  onComplete?: (data: IngredientParseQuery) => void,
  onError?: (error: ApolloError) => void
) => {
  const [parseIngredient, { data, loading, error }] =
    useLazyQuery<IngredientParseQuery>(INGREDIENT_PARSE_QUERY, {
      onCompleted: (data) => {
        onComplete && onComplete(data)
      },
      onError: (error) => {
        onError && onError(error)
      },
    })

  return {
    parseIngredient,
    data: data?.parseIngredient,
    loading,
    error,
  }
}

export const getUseIngredientParseQuery = () => useIngredientParseQuery
