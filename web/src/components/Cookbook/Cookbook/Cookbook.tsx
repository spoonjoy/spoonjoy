import { PencilIcon } from '@heroicons/react/24/outline'
import type { FindCookbookById } from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
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
    const description = `${author.username}'s ${title} Cookbook`

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
        <MetaTags title={`${description}`} description={description} />
        <HeaderSlot.Plug id="cookbooks" deps={[title]}>
          <DefaultHeader
            title={title}
            endChild={
              isOwner ? (
                <button
                  onClick={() =>
                    navigate(routes.cookbook({ id: cookbook.id, edit: true }))
                  }
                  className="btn-small-rounded-secondary"
                >
                  <span className="sr-only">Edit</span>
                  <PencilIcon className="h-4 w-4" />
                </button>
              ) : undefined
            }
          />
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
