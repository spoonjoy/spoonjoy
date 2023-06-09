import { GoogleAuthUrlQuery, LinkGoogleAccountMutation } from 'types/graphql'

import { useMutation, useQuery } from '@redwoodjs/web'

const GOOGLE_AUTH_URL_QUERY = gql`
  query GoogleAuthUrlQuery {
    getAuthUrl(provider: GOOGLE)
  }
`

const LINK_GOOGLE_ACCOUNT_MUTATION = gql`
  mutation LinkGoogleAccountMutation($code: String!) {
    linkAccount(provider: GOOGLE, code: $code) {
      id
      username
    }
  }
`

export const useGoogleAuthQuery = () => {
  const { data, loading, error } = useQuery<GoogleAuthUrlQuery>(
    GOOGLE_AUTH_URL_QUERY
  )

  return { data: data?.getAuthUrl, loading, error }
}

export const useLinkGoogleAccountMutation = () => {
  const [linkAccount, { loading, error }] =
    useMutation<LinkGoogleAccountMutation>(LINK_GOOGLE_ACCOUNT_MUTATION)

  return { linkAccount, loading, error }
}
