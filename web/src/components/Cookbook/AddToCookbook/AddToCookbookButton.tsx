import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'
import { FindCookbooksForDropdown } from 'types/graphql'

import AddToCookbookDialog from './AddToCookbookDialog'
import SignUpAndAddToCookbookDialog from './SignUpAndAddToCookbookDialog'

export interface IInMyCookbook {
  cookbookId: string
  __typename?: 'RecipeInCookbook' | undefined
}

interface IAddToCookbookButton {
  /** If this is null or undefined, it's because the user isn't logged in */
  myCookbooks?: FindCookbooksForDropdown['myCookbooks'] | null
  /** If this is null or undefined, it's because the user isn't logged in */
  inMyCookbooks?: IInMyCookbook[] | null
  currentRecipeId: string
}

export default function AddToCookbookButton({
  myCookbooks,
  inMyCookbooks,
  currentRecipeId,
}: IAddToCookbookButton) {
  const [openDialog, setOpenDialog] = React.useState<'add' | 'signup' | 'none'>(
    'none'
  )
  const [recipeInCookbooks, setRecipeInCookbooks] = React.useState(
    inMyCookbooks || []
  )

  const openAddDialog = () => {
    setOpenDialog('add')
  }
  const openSignupDialog = () => {
    setOpenDialog('signup')
  }

  const onOpenDialog = () => {
    if (myCookbooks && inMyCookbooks) {
      openAddDialog()
    } else {
      openSignupDialog()
    }
  }

  const dismissDialog = () => {
    setOpenDialog('none')
  }

  return (
    <>
      <AddToCookbookDialog
        myCookbooks={myCookbooks || []}
        recipeInCookbooks={recipeInCookbooks}
        setRecipeInCookbooks={setRecipeInCookbooks}
        currentRecipeId={currentRecipeId}
        isDialogOpen={openDialog === 'add'}
        dismissDialog={dismissDialog}
      />
      <SignUpAndAddToCookbookDialog
        isDialogOpen={openDialog === 'signup'}
        dismissDialog={dismissDialog}
      />
      <div className="relative inline-block text-left">
        <button
          onClick={(e) => {
            // We don't want the click to bubble up and trigger the Link, in case it's wrapped in one.
            e.stopPropagation()
            e.preventDefault()

            onOpenDialog()
          }}
          className="text-white"
        >
          <span className="sr-only">Add to cookbook</span>
          {inMyCookbooks && recipeInCookbooks.length > 0 ? (
            <BookmarkIconSolid
              className="h-5 w-5 hover:text-gray-300"
              aria-hidden="true"
            />
          ) : (
            <BookmarkIconOutline
              className="h-5 w-5 hover:text-gray-300"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </>
  )
}
