
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {  } from 'src/lib/formatters'

import type { DeleteCookbookMutationVariables, FindCookbookById } from 'types/graphql'

const DELETE_COOKBOOK_MUTATION = gql`
  mutation DeleteCookbookMutation($id: String!) {
    deleteCookbook(id: $id) {
      id
    }
  }
`

interface Props {
  cookbook: NonNullable<FindCookbookById['cookbook']>
}

const Cookbook = ({ cookbook }: Props) => {
  const [deleteCookbook] = useMutation(DELETE_COOKBOOK_MUTATION, {
    onCompleted: () => {
      toast.success('Cookbook deleted')
      navigate(routes.cookbooks())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteCookbookMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete cookbook ' + id + '?')) {
      deleteCookbook({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Cookbook {cookbook.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{cookbook.id}</td>
            </tr><tr>
              <th>Title</th>
              <td>{cookbook.title}</td>
            </tr><tr>
              <th>Author id</th>
              <td>{cookbook.authorId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editCookbook({ id: cookbook.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(cookbook.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Cookbook
