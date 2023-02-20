import type { FindRecipeById } from 'types/graphql'

import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import AddToCookbookButton from 'src/components/Cookbook/AddToCookbook/AddToCookbookButton'
import AddToCookbookButtonCell from 'src/components/Cookbook/AddToCookbookButtonCell'
import IngredientsItemsList, {
  IStepInfoForList,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import ReloadIngredientsItemsList from 'src/components/IngredientsItemsList/ReloadIngredientsItemsList'
import UserInfo from 'src/components/shared/UserInfo/UserInfo'
import { classNames } from 'src/helpers/css'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

import RecipeControlBar from './RecipeControlBar'

interface Props {
  recipe: NonNullable<FindRecipeById['recipe']> | undefined
}

const Recipe = ({ recipe }: Props) => {
  const { currentUser } = useAuth()
  const isOwnRecipe = recipe && recipe.chef.id === currentUser?.id

  const listItemIds =
    recipe &&
    recipe.steps.flatMap((step) => {
      const ingIds = step!.ingredients?.length
        ? step.ingredients.flatMap((ingredient) => {
            return ingredient!.id
          })
        : []
      const stepUsageIds = step!.stepOutputUses?.length
        ? step.stepOutputUses.flatMap((stepOutputUse) => {
            return stepOutputUse!.id
          })
        : []
      return [...ingIds, ...stepUsageIds]
    })

  const website =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost'
      : 'https://spoonjoy.app'

  return (
    <>
      <MetaTags
        title={`${recipe?.title || 'loading...'}`}
        description={recipe && (recipe.description || `${recipe.title} page.`)}
        ogUrl={recipe ? `${website}/recipes/${recipe.id}` : undefined}
        ogContentUrl={
          recipe &&
          `https://images.spoonjoy.app/api/recipe?title=${encodeURIComponent(
            recipe.title
          )}&subtitle=${encodeURIComponent(recipe.description || '')}`
        }
      />
      <HeaderSlot.Plug id="recipe">
        <div
          style={
            recipe && {
              backgroundImage: `url('${recipe.imageUrl}')`,
            }
          }
          className={classNames(
            'relative m-auto h-[350px] bg-cover bg-bottom sm:h-[400px] md:h-[500px] lg:w-[900px]',
            !recipe && 'loading'
          )}
        >
          {recipe && (
            <div className="absolute bottom-0 w-full">
              <div className="relative mx-auto mb-4 flex min-h-[140px] w-[350px] flex-col justify-between rounded-md p-4 text-white backdrop-blur backdrop-brightness-50 sm:min-h-[160px] sm:w-[600px] md:mb-6 md:min-h-[170px]">
                {/* Header text */}
                <div>
                  <span className="mb-2 block text-base font-medium leading-snug tracking-wide opacity-[95%]">
                    {recipe.title}
                  </span>
                  <span className="block text-sm font-normal leading-snug tracking-wide opacity-[85%]">
                    {recipe.description}
                  </span>
                </div>
                {/* Chef info and cookbook dropdown */}
                <div className="flex justify-between">
                  {/* Chef info */}
                  <UserInfo username={recipe.chef.username} />
                  {/* Cookbook dropdown */}
                  <div className="mt-2 mr-2">
                    {/*
                     * Three inMyCookbooks scenarios:
                     * - Stuff in array -> user has added recipes to their cookbooks
                     * - Nothing in array -> user has not yet added recipes to their cookbooks
                     * - Null or undefined -> user is not logged in
                     *  - TODO This should updated whenever I figure out if it should be null OR undefined (cuz I feel like it's weird to have both, but it shouldn't hurt)
                     */}
                    {recipe.inMyCookbooks && currentUser?.username ? (
                      <AddToCookbookButtonCell
                        currentRecipeId={recipe.id}
                        inMyCookbooks={recipe.inMyCookbooks}
                        username={currentUser.username}
                      />
                    ) : (
                      <AddToCookbookButton currentRecipeId={recipe.id} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </HeaderSlot.Plug>
      <div className="my-6 flex justify-center">
        <ReloadIngredientsItemsList
          label={'Clear Progress'}
          itemIds={listItemIds}
        />
      </div>
      {recipe?.steps && (
        <div className="m-auto mb-7 max-w-xl">
          {recipe.steps.map((step) => {
            const {
              stepNum,
              stepTitle,
              description,
              ingredients,
              stepOutputUses,
            } = step!
            return (
              <div key={stepNum}>
                {stepNum !== 1 && (
                  <div className="my-6 flex justify-center gap-1">
                    <div className="w-[8px] rounded-xl border-b-8 border-indigo-700" />
                    <div className="w-[8px] rounded-xl border-b-8 border-indigo-700" />
                    <div className="w-[8px] rounded-xl border-b-8 border-indigo-700" />
                  </div>
                )}
                <h2 className="block text-lg font-medium leading-none text-gray-900">
                  step {stepNum}
                  {stepTitle && (
                    <span>
                      {': '}
                      <span className="font-normal">{stepTitle}</span>
                    </span>
                  )}
                </h2>
                {ingredients && (
                  <div className="m-auto my-5 grid max-w-xs gap-y-4">
                    {ingredients.length > 0 && (
                      <IngredientsItemsList
                        items={ingredients}
                        listType="recipeIngredients"
                      />
                    )}
                    {stepOutputUses.length > 0 && (
                      <IngredientsItemsList
                        items={stepOutputUses}
                        steps={recipe.steps as IStepInfoForList}
                        listType="stepOutputUses"
                      />
                    )}
                  </div>
                )}
                <div className="text-gray-800">
                  <p>{description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {isOwnRecipe && (
        <RecipeControlBar
          recipeId={recipe.id}
          ownerUsername={recipe.chef.username}
        />
      )}
    </>
  )
}

export default Recipe
