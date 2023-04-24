import { useLazyQuery } from '@apollo/client'
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
  onComplete?: (data: IngredientParseQuery) => void
) => {
  const [parseIngredient, { data, loading, error }] =
    useLazyQuery<IngredientParseQuery>(INGREDIENT_PARSE_QUERY, {
      onCompleted: (data) => {
        onComplete && onComplete(data)
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
