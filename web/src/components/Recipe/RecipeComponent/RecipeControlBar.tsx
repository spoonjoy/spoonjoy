import { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { DeleteRecipeMutationVariables } from 'types/graphql'

import { Link, navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import Alert from 'src/components/Dialogs/ConfirmationDialogs/Alert'
import { classNames } from 'src/helpers/css'

const DELETE_RECIPE_MUTATION = gql`
  mutation DeleteRecipeMutation($id: String!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`

interface RecipeEditDeleteBtnProps {
  recipeId: DeleteRecipeMutationVariables['id']
  ownerUsername: string
}
const RecipeEditDeleteBtn = ({
  recipeId,
  ownerUsername,
}: RecipeEditDeleteBtnProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('Recipe deleted')
      navigate(routes.user({ username: ownerUsername }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = () => {
    setIsDialogOpen(true)
  }
  const onConfirmDelete = () => {
    setIsDialogOpen(false)
    deleteRecipe({ variables: { id: recipeId } })
  }
  const onCancelDelete = () => {
    setIsDialogOpen(false)
  }

  const dropdownItems = [{ name: 'Delete Recipe', onClick: onDeleteClick }]

  return (
    <>
      <Alert
        openState={isDialogOpen}
        header={'Delete Recipe'}
        body={
          'If you delete your recipe, you\'ll never see it again! Until we get around to creating the "recently deleted" section, but who knows how long that will take.'
        }
        confirmTxt={'Delete'}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <div className="inline-flex rounded-md shadow-sm">
        <Link
          to={routes.editRecipe({ id: recipeId })}
          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          Edit Recipe
        </Link>
        <Menu as="div" className="relative -ml-px block">
          <Menu.Button className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <span className="sr-only">Open options</span>
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {dropdownItems.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <button
                        onClick={item.onClick}
                        className={classNames(
                          active ? 'bg-gray-100 text-red-900' : 'text-red-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        {item.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  )
}

interface RecipeControlBarProps extends RecipeEditDeleteBtnProps {}
const RecipeControlBar = (props: RecipeControlBarProps) => {
  return (
    <div className="flex justify-end">
      <RecipeEditDeleteBtn {...props} />
    </div>
  )
}

export default RecipeControlBar
