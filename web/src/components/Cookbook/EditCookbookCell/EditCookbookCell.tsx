import type { EditCookbookById, UpdateCookbookInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY as CookbookQuery } from 'src/components/Cookbook/CookbookCell/CookbookCell'
import CookbookForm, {
  onUpdateCookbook,
} from 'src/components/Cookbook/CookbookForm'

export const QUERY = gql`
  query EditCookbookById($id: String!) {
    cookbook: cookbook(id: $id) {
      id
      title
      authorId
    }
  }
`
const UPDATE_COOKBOOK_MUTATION = gql`
  mutation UpdateCookbookMutation($id: String!, $input: UpdateCookbookInput!) {
    updateCookbook(id: $id, input: $input) {
      id
      title
      authorId
    }
  }
`

const REFETCH_COOKBOOK_TITLE = gql`
  query QueryCookbookTitle($id: String!) {
    cookbook: cookbook(id: $id) {
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ cookbook }: CellSuccessProps<EditCookbookById>) => {
  const [updateCookbook, { loading, error }] = useMutation(
    UPDATE_COOKBOOK_MUTATION,
    {
      onCompleted: () => {
        toast.success('Cookbook updated')
        navigate(routes.cookbook({ id: cookbook.id }))
      },
      onError: (error) => {
        toast.error(error.message)
      },
      refetchQueries: [
        { query: REFETCH_COOKBOOK_TITLE, variables: { id: cookbook.id } },
      ],
    }
  )

  const onSave: onUpdateCookbook = (id: string, input: UpdateCookbookInput) => {
    updateCookbook({ variables: { id, input } })
  }

  return (
    <CookbookForm
      cookbook={cookbook}
      onSave={onSave}
      error={error}
      loading={loading}
    />
  )
}
