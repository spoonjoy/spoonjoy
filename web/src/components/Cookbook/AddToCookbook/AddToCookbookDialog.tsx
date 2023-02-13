import { Dialog } from '@headlessui/react'
import {
  AddToCookbookMutation,
  RemoveFromCookbookMutation,
  FindCookbooksForDropdown,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import DialogBase from 'src/components/Dialogs/DialogBase'
import { classNames } from 'src/helpers/css'

import { IInMyCookbook } from './AddToCookbookButton'

interface IAddToCookbookDialogProps {
  myCookbooks: FindCookbooksForDropdown['myCookbooks']
  recipeInCookbooks: IInMyCookbook[]
  setRecipeInCookbooks: React.Dispatch<React.SetStateAction<IInMyCookbook[]>>
  currentRecipeId: string
  isDialogOpen: boolean
  dismissDialog: () => void
}

const AddToCookbookDialog = ({
  myCookbooks,
  recipeInCookbooks,
  setRecipeInCookbooks,
  currentRecipeId,
  isDialogOpen,
  dismissDialog,
}: IAddToCookbookDialogProps) => {
  const addButtonRef = React.useRef(null)

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
    <DialogBase
      openState={isDialogOpen}
      onClose={dismissDialog}
      initialFocusRef={addButtonRef}
      withCloseButton
    >
      <Dialog.Title
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900"
      >
        Add to cookbook
      </Dialog.Title>
      <ul className=" min-w-[300px] divide-y divide-gray-200">
        {myCookbooks.map((cookbook, idx) => {
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
                        ? 'btn-small-rounded-secondary'
                        : 'btn-small-rounded-primary'
                    )}
                    ref={idx === 0 ? addButtonRef : undefined}
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
  )
}

export default AddToCookbookDialog
