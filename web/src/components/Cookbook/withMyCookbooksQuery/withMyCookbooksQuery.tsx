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

function withMyCookbooksQuery<
  T extends { myCookbooks?: MyCookbooksQuery['myCookbooks'] }
>(WrappedComponent: React.ComponentType<T>, username?: string | null) {
  return function MyCookbooksHOC(props: Omit<T, 'myCookbooks'>) {
    const { data, loading, error } = useQuery<MyCookbooksQuery>(
      MY_COOKBOOKS_QUERY,
      {
        variables: { username: username || '' },
      }
    )

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    const myCookbooks = data?.myCookbooks

    return <WrappedComponent {...(props as T)} myCookbooks={myCookbooks} />
  }
}

export default withMyCookbooksQuery
