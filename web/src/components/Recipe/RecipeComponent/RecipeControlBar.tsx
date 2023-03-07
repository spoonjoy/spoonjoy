import { Fragment } from 'react'

import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { DeleteRecipeMutationVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import DeleteRecipe from 'src/components/Dialogs/ConfirmationDialogs/DeleteRecipe/DeleteRecipe'
import { classNames } from 'src/helpers/css'

interface RecipeEditDeleteBtnProps {
  recipeId: DeleteRecipeMutationVariables['id']
  ownerUsername: string
}
const RecipeEditDeleteBtn = ({
  recipeId,
  ownerUsername,
}: RecipeEditDeleteBtnProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const onDeleteClick = () => {
    setIsDialogOpen(true)
  }

  const dropdownItems = [{ name: 'delete recipe', onClick: onDeleteClick }]

  return (
    <>
      <DeleteRecipe
        recipeId={recipeId}
        ownerUsername={ownerUsername}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <div className="mb-5 inline-flex rounded-md shadow-sm">
        <Link
          to={routes.editRecipe({ id: recipeId })}
          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          edit recipe
        </Link>
        <Menu as="div" className="relative -ml-px block">
          <Menu.Button className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <span className="sr-only">open options</span>
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
