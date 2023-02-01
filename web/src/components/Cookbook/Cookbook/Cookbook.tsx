import type { FindCookbookById } from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import Recipes from 'src/components/Recipe/Recipes'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

import CreateEditCookbookDialog from '../CreateEditCookbook/CreateEditCookbookDialog'

interface Props {
  cookbook: NonNullable<FindCookbookById['cookbook']>
}

const Cookbook = ({ cookbook }: Props) => {
  const { edit } = useParams()

  const recipes = cookbook.recipes.map((recipeInCookbook) => {
    return recipeInCookbook?.recipe
  })
  const description = `${cookbook.author.username}'s ${cookbook.title} Cookbook`
  return (
    <>
      <CreateEditCookbookDialog
        dialogOpen={edit === 'true'}
        onClose={() => {
          navigate(routes.cookbook({ id: cookbook.id, edit: false }))
        }}
      />
      <MetaTags title={`${description} | Spoonjoy`} description={description} />
      <HeaderSlot.Plug id="cookbooks">
        <DefaultHeader
          title={cookbook.title}
          endChild={
            <button
              onClick={() =>
                navigate(routes.cookbook({ id: cookbook.id, edit: true }))
              }
              className="btn-small-rounded-secondary"
            >
              Edit
            </button>
          }
        />
      </HeaderSlot.Plug>
      <Recipes recipes={recipes} />
    </>
  )
}

export default Cookbook
