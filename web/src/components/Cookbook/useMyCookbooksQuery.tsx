import { MyCookbooksQuery } from 'types/graphql'

import { useQuery } from '@redwoodjs/web'

const MY_COOKBOOKS_QUERY = gql`
  query MyCookbooksQuery($username: String!) {
    myCookbooks: usersCookbooks(username: $username) {
      id
      title
    }
  }
`

const useMyCookbooksQuery = (username?: string) => {
  const { data, loading, error } = useQuery<MyCookbooksQuery>(
    MY_COOKBOOKS_QUERY,
    {
      variables: { username: username || '' },
    }
  )

  return { data: data?.myCookbooks, loading, error }
}

export default useMyCookbooksQuery
