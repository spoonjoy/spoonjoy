import type {
  DeleteCookbookMutationVariables,
  FindCookbooks,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Cookbook/CookbooksCell'
import { truncate } from 'src/lib/formatters'

const DELETE_COOKBOOK_MUTATION = gql`
  mutation DeleteCookbookMutation($id: String!) {
    deleteCookbook(id: $id) {
      id
    }
  }
`

const CookbooksList = ({ cookbooks }: FindCookbooks) => {
  const [deleteCookbook] = useMutation(DELETE_COOKBOOK_MUTATION, {
    onCompleted: () => {
      toast.success('Cookbook deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteCookbookMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete cookbook ' + id + '?')) {
      deleteCookbook({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Author id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {cookbooks.map((cookbook) => (
            <tr key={cookbook.id}>
              <td>{truncate(cookbook.id)}</td>
              <td>{truncate(cookbook.title)}</td>
              <td>{truncate(cookbook.authorId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.cookbook({ id: cookbook.id })}
                    title={'Show cookbook ' + cookbook.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editCookbook({ id: cookbook.id })}
                    title={'Edit cookbook ' + cookbook.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete cookbook ' + cookbook.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(cookbook.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CookbooksList
