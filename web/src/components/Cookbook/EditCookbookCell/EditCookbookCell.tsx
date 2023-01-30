import type { EditCookbookById, UpdateCookbookInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import CookbookForm from 'src/components/Cookbook/CookbookForm'

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
        navigate(routes.cookbooks())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateCookbookInput,
    id: EditCookbookById['cookbook']['id']
  ) => {
    updateCookbook({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Cookbook {cookbook?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <CookbookForm cookbook={cookbook} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
