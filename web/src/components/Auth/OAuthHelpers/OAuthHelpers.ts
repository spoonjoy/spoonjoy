import {
  GoogleAuthUrlQuery,
  LinkGoogleAccountMutation,
  Provider,
} from 'types/graphql'

import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import { USER_OAUTH_CONNECTIONS_QUERY } from 'src/components/User/UserSettings/UserOAuthConnectionsCell/UserOAuthConnectionsQuery'

const AUTH_URL_QUERY = gql`
  query GoogleAuthUrlQuery($provider: Provider!) {
    getAuthUrl(provider: $provider)
  }
`

const LINK_GOOGLE_ACCOUNT_MUTATION = gql`
  mutation LinkGoogleAccountMutation($code: String!) {
    linkAccount(provider: GOOGLE, code: $code) {
      provider
      userId
    }
  }
`

const UNLINK_GOOGLE_ACCOUNT_MUTATION = gql`
  mutation UnlinkGoogleAccountMutation {
    unlinkAccount(provider: GOOGLE) {
      provider
      userId
    }
  }
`

export const useAuthQuery = (provider: Provider) => {
  const { data, loading, error } = useQuery<GoogleAuthUrlQuery>(
    AUTH_URL_QUERY,
    {
      variables: { provider },
    }
  )

  return { data: data?.getAuthUrl, loading, error }
}

export const useLinkGoogleAccountMutation = () => {
  const [linkAccount, { loading, error }] =
    useMutation<LinkGoogleAccountMutation>(LINK_GOOGLE_ACCOUNT_MUTATION, {
      onError: (error) => {
        toast.error(error.message)
      },
      onCompleted: (data) => {
        toast.success(
          `successfully linked ${data.linkAccount.provider.toLowerCase()} account`
        )
      },
    })

  return { linkAccount, loading, error }
}

export const useUnlinkGoogleAccountMutation = () => {
  const { currentUser } = useAuth()
  const [unlinkAccount, { loading, error }] = useMutation(
    UNLINK_GOOGLE_ACCOUNT_MUTATION,
    {
      onError: (error) => {
        toast.error(error.message)
      },
      onCompleted: (data) => {
        toast.success(
          `successfully unlinked ${data.unlinkAccount.provider.toLowerCase()} account`
        )
      },
      refetchQueries: [
        {
          query: USER_OAUTH_CONNECTIONS_QUERY,
          variables: { id: currentUser?.id },
        },
      ],
    }
  )

  return { unlinkAccount, loading, error }
}
