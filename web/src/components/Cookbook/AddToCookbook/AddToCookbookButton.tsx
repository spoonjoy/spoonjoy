import { Dialog } from '@headlessui/react'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import {
  AddToCookbookMutation,
  RemoveFromCookbookMutation,
  FindCookbooksForDropdown,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import DialogBase from 'src/components/Dialogs/DialogBase'
import { classNames } from 'src/helpers/css'

const ADD_TO_COOKBOOK_MUTATION = gql`
  mutation AddToCookbookMutation($id: String!, $recipeId: String!) {
    addToCookbook(id: $id, recipeId: $recipeId) {
      cookbook {
        id
      }
    }
  }
`

const REMOVE_FROM_COOKBOOK_MUTATION = gql`
  mutation RemoveFromCookbookMutation($id: String!, $recipeId: String!) {
    removeFromCookbook(id: $id, recipeId: $recipeId) {
      cookbook {
        id
      }
    }
  }
`

export interface IInMyCookbook {
  cookbookId: string
  __typename?: 'RecipeInCookbook' | undefined
}

interface IAddToCookbookButton {
  myCookbooks: FindCookbooksForDropdown['myCookbooks']
  inMyCookbooks: IInMyCookbook[]
  currentRecipeId: string
}

export default function AddToCookbookButton({
  myCookbooks,
  inMyCookbooks,
  currentRecipeId,
}: IAddToCookbookButton) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const [recipeInCookbooks, setRecipeInCookbooks] =
    React.useState(inMyCookbooks)

  const [addToCookbook, { loading: loadingAdd }] =
    useMutation<AddToCookbookMutation>(ADD_TO_COOKBOOK_MUTATION, {
      onCompleted: (data) => {
        toast.success(`Added to cookbook`)
        setIsDialogOpen(false)
        const newRecipeInCookbook: IInMyCookbook = {
          cookbookId: data.addToCookbook.cookbook.id,
          __typename: 'RecipeInCookbook',
        }
        const newRecipeInCookbooks = [...recipeInCookbooks, newRecipeInCookbook]

        setRecipeInCookbooks(newRecipeInCookbooks)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const [removeFromCookbook, { loading: loadingRemove }] =
    useMutation<RemoveFromCookbookMutation>(REMOVE_FROM_COOKBOOK_MUTATION, {
      onCompleted: (data) => {
        toast.success(`Removed from cookbook`)
        setRecipeInCookbooks((current) =>
          current.filter(
            (inMyCookbook) =>
              inMyCookbook.cookbookId !== data.removeFromCookbook.cookbook.id
          )
        )
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  const openDialog = () => {
    setIsDialogOpen(true)
  }
  const dismissDialog = () => {
    setIsDialogOpen(false)
  }

  const getOnToggleRecipe =
    (cookbookId: string, alreadyInCookbook: boolean) => () => {
      if (alreadyInCookbook) {
        removeFromCookbook({
          variables: { id: cookbookId, recipeId: currentRecipeId },
        })
      } else {
        addToCookbook({
          variables: { id: cookbookId, recipeId: currentRecipeId },
        })
      }
    }

  return (
    <>
      <DialogBase
        openState={isDialogOpen}
        onClose={dismissDialog}
        withCloseButton
      >
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          Add to cookbook
        </Dialog.Title>
        <ul className=" min-w-[300px] divide-y divide-gray-200">
          {myCookbooks.map((cookbook) => {
            const alreadyInCookbook = recipeInCookbooks.find(
              (e) => e.cookbookId === cookbook.id
            )
            return (
              <li key={cookbook.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {cookbook.title}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={getOnToggleRecipe(
                        cookbook.id,
                        !!alreadyInCookbook
                      )}
                      disabled={loadingAdd || loadingRemove}
                      className={classNames(
                        alreadyInCookbook
                          ? 'border-white bg-indigo-700 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500',
                        't inline-flex items-center rounded-full  border px-2.5 py-0.5 text-sm font-medium leading-5 shadow-sm'
                      )}
                    >
                      {alreadyInCookbook ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </DialogBase>
      <div className="relative inline-block text-left">
        <button
          onClick={openDialog}
          className="inline-flex w-full justify-center text-sm font-medium text-white shadow-sm hover:text-gray-300"
        >
          <span className="sr-only">Add to cookbook</span>
          <BookmarkIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
