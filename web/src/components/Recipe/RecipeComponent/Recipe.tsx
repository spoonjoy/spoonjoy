import type { FindRecipeById } from 'types/graphql'

import { routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import AddToCookbookButton from 'src/components/Cookbook/AddToCookbook/AddToCookbookButton'
import AddToCookbookButtonCell from 'src/components/Cookbook/AddToCookbookButtonCell'
import IngredientsItemsList, {
  IStepInfoForList,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import ReloadIngredientsItemsList from 'src/components/IngredientsItemsList/ReloadIngredientsItemsList'
import ActionButtonsContainer from 'src/components/shared/ActionButtons/ActionButtonsContainer/ActionButtonsContainer'
import ShareButton from 'src/components/shared/ActionButtons/ShareButton/ShareButton'
import UserInfo from 'src/components/shared/UserInfo/UserInfo'
import { classNames } from 'src/helpers/css'
import { multiplyNumbersInString } from 'src/helpers/numbers'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

import RecipeControlBar from './RecipeControlBar'
import RecipeScaleFactor from './RecipeScaleFactor'

interface Props {
  recipe?: NonNullable<FindRecipeById['recipe']>
}

const Recipe = ({ recipe }: Props) => {
  const { currentUser } = useAuth()
  const isOwnRecipe = recipe && recipe.chef.id === currentUser?.id

  const [scaleFactor, setScaleFactor] = React.useState(1)

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
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dpjmyc4uz/image/upload/w_900/${recipe?.id}')`,
          }}
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
                  {recipe.sourceUrl && (
                    <a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mb-2 -mt-2 block text-xs font-normal tracking-wide"
                    >
                      <span className="opacity-[60%]">originally from </span>
                      <span className="underline opacity-[60%] group-hover:opacity-90 group-focus:opacity-90">
                        {new URL(recipe.sourceUrl).hostname.replace('www.', '')}
                      </span>
                    </a>
                  )}
                  <article className="block text-sm font-normal leading-snug tracking-wide opacity-[85%]">
                    {recipe.description}
                  </article>
                </div>
                {/* Chef info and cookbook dropdown */}
                <div className="flex justify-between">
                  {/* Chef info */}
                  <UserInfo username={recipe.chef.username} />
                  {/* Action buttons */}
                  <ActionButtonsContainer location="recipe-header">
                    <ShareButton
                      title={`"${recipe.title}" by ${recipe.chef.username}`}
                      text={
                        currentUser?.id === recipe.chef.id
                          ? `i LOVE my ${recipe.title} recipe`
                          : `i LOVE ari's ${recipe.title} recipe`
                      }
                      url={routes.recipe({ id: recipe.id })}
                    />
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
                  </ActionButtonsContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </HeaderSlot.Plug>
      {recipe?.servings && (
        <div className="-mb-3 mt-5 text-center text-sm italic">
          makes {multiplyNumbersInString(recipe.servings, scaleFactor)}
        </div>
      )}
      <div className="my-6 flex justify-center gap-5">
        <ReloadIngredientsItemsList
          label={'clear progress'}
          itemIds={listItemIds}
        />
        <RecipeScaleFactor
          loading={!recipe}
          scaleFactor={scaleFactor}
          setScaleFactor={setScaleFactor}
        />
      </div>
      <div className="mx-3 mb-7 max-w-xl sm:m-auto">
        {recipe?.steps ? (
          recipe.steps.map((step) => {
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
                        scaleFactor={scaleFactor}
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
          })
        ) : (
          <>
            <div className="loading h-8 w-full" />
            <div className="m-auto my-5 grid max-w-xs gap-y-4">
              <IngredientsItemsList />
            </div>
            <div className="loading mb-1 h-6 w-full" />
            <div className="loading mb-1 h-6 w-full" />
            <div className="loading mb-1 h-6 w-full" />
          </>
        )}
      </div>

      {isOwnRecipe && <RecipeControlBar recipeId={recipe.id} />}
    </>
  )
}

export default Recipe
