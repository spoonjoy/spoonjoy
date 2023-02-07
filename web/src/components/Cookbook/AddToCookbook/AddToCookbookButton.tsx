import { BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'
import { FindCookbooksForDropdown } from 'types/graphql'

import AddToCookbookDialog from './AddToCookbookDialog'

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

  const openDialog = () => {
    setIsDialogOpen(true)
  }
  const dismissDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <AddToCookbookDialog
        myCookbooks={myCookbooks}
        recipeInCookbooks={recipeInCookbooks}
        setRecipeInCookbooks={setRecipeInCookbooks}
        currentRecipeId={currentRecipeId}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        dismissDialog={dismissDialog}
      />
      <div className="relative inline-block text-left">
        <button
          onClick={(e) => {
            // We don't want the click to bubble up and trigger the Link, in case it's wrapped in one.
            e.stopPropagation()
            e.preventDefault()

            openDialog()
          }}
          className="text-white"
        >
          <span className="sr-only">Add to cookbook</span>
          {recipeInCookbooks.length > 0 ? (
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
