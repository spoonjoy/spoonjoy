import { Dialog } from '@headlessui/react'
import { FindCookbooksForDropdown } from 'types/graphql'

import DialogBase from 'src/components/Dialogs/DialogBase'
import { classNames } from 'src/helpers/css'

import withAddRemoveCookbookMutations, {
  IWithAddRemoveCookbookMutationsChildProps,
} from '../withAddRemoveCookbookMutations/withAddRemoveCookbookMutations'

import { IInMyCookbook } from './AddToCookbookButton'

interface IAddToCookbookDialogProps {
  myCookbooks: FindCookbooksForDropdown['myCookbooks']
  recipeInCookbooks: IInMyCookbook[]
  currentRecipeId: string
  isDialogOpen: boolean
  dismissDialog: () => void
}

const AddToCookbookDialogRenderer = ({
  myCookbooks,
  recipeInCookbooks,
  currentRecipeId,
  isDialogOpen,
  dismissDialog,
  onAddToCookbook,
  onRemoveFromCookbook,
  loadingAdd,
  loadingRemove,
}: IAddToCookbookDialogProps & IWithAddRemoveCookbookMutationsChildProps) => {
  const addButtonRef = React.useRef(null)

  const getOnToggleRecipe =
    (cookbookId: string, alreadyInCookbook: boolean) => () => {
      if (alreadyInCookbook) {
        onRemoveFromCookbook(cookbookId, currentRecipeId)
      } else {
        onAddToCookbook(cookbookId, currentRecipeId)
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

interface IAddToCookbookDialogContainerProps {
  setRecipeInCookbooks: React.Dispatch<React.SetStateAction<IInMyCookbook[]>>
}

const AddToCookbookDialogContainer = ({
  setRecipeInCookbooks,
  myCookbooks,
  recipeInCookbooks,
  currentRecipeId,
  isDialogOpen,
  dismissDialog,
}: IAddToCookbookDialogContainerProps & IAddToCookbookDialogProps) => {
  const onAddToCookbookComplete = (cookbookId: string) => {
    dismissDialog()
    const newRecipeInCookbook: IInMyCookbook = {
      cookbookId,
      __typename: 'RecipeInCookbook',
    }
    const newRecipeInCookbooks = [...recipeInCookbooks, newRecipeInCookbook]

    setRecipeInCookbooks(newRecipeInCookbooks)
  }

  const onRemoveFromCookbookComplete = (cookbookId: string) => {
    setRecipeInCookbooks((current) =>
      current.filter((inMyCookbook) => inMyCookbook.cookbookId !== cookbookId)
    )
  }

  const ChildComponent =
    withAddRemoveCookbookMutations<IAddToCookbookDialogProps>({
      child: AddToCookbookDialogRenderer,
      onAddToCookbookComplete,
      onRemoveFromCookbookComplete,
      outerProps: {
        myCookbooks,
        recipeInCookbooks,
        currentRecipeId,
        isDialogOpen,
        dismissDialog,
      },
    })

  return <ChildComponent />
}

export default AddToCookbookDialogContainer
