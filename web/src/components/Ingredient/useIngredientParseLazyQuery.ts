import { useLazyQuery } from '@apollo/client'
import { debounce } from 'lodash'
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

interface IUseIngredientParseQuery {
  input: string
}

export const useIngredientParseQuery = ({
  input,
}: IUseIngredientParseQuery) => {
  const [parseIngredient, { data, loading, error }] =
    useLazyQuery<IngredientParseQuery>(INGREDIENT_PARSE_QUERY, {
      variables: { input },
    })

  const debouncedParseIngredient = debounce(parseIngredient, 1000)

  return {
    parseIngredient: debouncedParseIngredient,
    data: data?.parseIngredient,
    loading,
    error,
  }
}

export const getUseIngredientParseQuery = () => useIngredientParseQuery
