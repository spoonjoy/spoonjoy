import type { FindRecipeById } from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'

import IngredientsItemsList from 'src/components/IngredientsItemsList/IngredientsItemsList'
import ReloadIngredientsItemsList from 'src/components/IngredientsItemsList/ReloadIngredientsItemsList'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'
import { ListItemType } from 'src/stores/ListItemsStore'

import RecipeControlBar from './RecipeControlBar'

const TimeTag = ({ datetime }: { datetime: string }) => {
  console.log(datetime)
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toUTCString()}
    </time>
  )
}

interface Props {
  recipe: NonNullable<FindRecipeById['recipe']>
}

const Recipe = ({ recipe }: Props) => {
  const { currentUser } = useAuth()
  const isOwnRecipe = recipe.chef.id === currentUser?.id

  const listItemIds = recipe.steps.flatMap((step) => {
    return step!.ingredients.flatMap((ingredient) => {
      return ingredient!.id
    })
  })

  return (
    <>
      <MetaTags title="Recipe" description="Recipe" />
      <HeaderSlot.Plug id="recipe">
        <div className=" leading-[.8]">
          <span>{recipe.title}</span>
          <br />
          <span className="ml-2 text-sm font-normal">
            by <span className="font-bold">{recipe.chef.username}</span> on{' '}
            <TimeTag datetime={recipe.createdAt} />
          </span>
        </div>
      </HeaderSlot.Plug>
      <p className="py-5 text-gray-900">{recipe.description}</p>

      <div className="flex justify-center ">
        <ReloadIngredientsItemsList
          label={'Clear Progress'}
          itemIds={listItemIds}
        />
      </div>

      <div>
        {recipe.steps.map((step) => {
          const { stepNum, description, ingredients } = step!
          return (
            <div key={stepNum} className="mt-2">
              <h2 className="text-lg font-medium text-gray-900">
                step {stepNum}
              </h2>
              {ingredients && (
                <div className="m-5 max-w-xs">
                  <IngredientsItemsList
                    items={ingredients}
                    itemsType={ListItemType.Ingredient}
                  />
                </div>
              )}
              <div className="pb-5 text-gray-800">
                <p>{description}</p>
              </div>
            </div>
          )
        })}
      </div>
      {isOwnRecipe && <RecipeControlBar recipeId={recipe.id} />}
    </>
  )
}

export default Recipe
