import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { FindCookbookById } from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import DeleteCookbook from 'src/components/Dialogs/ConfirmationDialogs/DeleteCookbook/DeleteCookbook'
import Recipes from 'src/components/Recipe/Recipes'
import EmptyState from 'src/components/shared/EmptyState'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

import CreateEditCookbookDialog from '../CreateEditCookbook/CreateEditCookbookDialog'

interface Props {
  cookbook?: NonNullable<FindCookbookById['cookbook']>
}

const Cookbook = ({ cookbook }: Props) => {
  const { currentUser } = useAuth()
  const { edit } = useParams()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  if (!cookbook) {
    return (
      <>
        <HeaderSlot.Plug id="loading">
          <DefaultHeader />
        </HeaderSlot.Plug>
        <Recipes />
      </>
    )
  } else {
    const { title, author } = cookbook

    const recipes = cookbook.recipes.map((recipeInCookbook) => {
      return recipeInCookbook?.recipe
    })
    const description = `${author.username}'s "${title}" cookbook`

    const isOwner = currentUser?.id === author.id

    return (
      <>
        <CreateEditCookbookDialog
          dialogOpen={edit === 'true'}
          onClose={() => {
            navigate(routes.cookbook({ id: cookbook.id, edit: false }))
          }}
          editCookbookId={cookbook.id}
        />
        <DeleteCookbook
          cookbookId={cookbook.id}
          isDialogOpen={isDeleteDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />
        <MetaTags title={`${description}`} description={description} />
        <HeaderSlot.Plug id="cookbooks" deps={[title]}>
          <>
            <DefaultHeader
              title={title}
              shareButtonProps={{
                title: description,
                text: isOwner
                  ? `i LOVE the recipes in my ${title} cookbook`
                  : `i LOVE ${author.username}'s ${title} cookbook`,
                url: routes.cookbook({ id: cookbook.id }),
                onLightBackground: true,
              }}
              endChild={
                isOwner ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        navigate(
                          routes.cookbook({ id: cookbook.id, edit: true })
                        )
                      }
                      className="btn-small-rounded-secondary"
                    >
                      <span className="sr-only">Edit</span>
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="btn-small-rounded-secondary"
                    >
                      <span className="sr-only">Delete</span>
                      <TrashIcon className="h-4 w-4 text-red-800" />
                    </button>
                  </div>
                ) : undefined
              }
              byLine={isOwner ? undefined : `${cookbook.author.username}`}
            />
          </>
        </HeaderSlot.Plug>
        {recipes.length ? (
          <Recipes recipes={recipes} />
        ) : isOwner ? (
          <EmptyState
            header="No recipes in this cookbook yet"
            subHeader="Get started by adding some recipes to this cookbook. You can do that by clicking the 'bookmark' button on any recipe page."
            ctaRoute={routes.user({
              username: author.username,
              page: 'recipes',
            })}
            cta="My Recipes"
            isOwner
          />
        ) : (
          <EmptyState
            header="No recipes in this cookbook yet"
            subHeader={`${author.username} hasn't added any recipes to this cookbook yet.`}
          />
        )}
      </>
    )
  }
}

export default Cookbook
