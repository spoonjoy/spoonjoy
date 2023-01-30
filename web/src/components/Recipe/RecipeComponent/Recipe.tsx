import ChefRJ from 'public/images/chef-rj.png'
import type { FindRecipeById } from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'

import IngredientsItemsList, {
  IStepInfoForList,
} from 'src/components/IngredientsItemsList/IngredientsItemsList'
import ReloadIngredientsItemsList from 'src/components/IngredientsItemsList/ReloadIngredientsItemsList'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

import RecipeControlBar from './RecipeControlBar'

const TimeTag = ({ datetime }: { datetime: string }) => {
  console.log(datetime)
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toDateString()}
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
        title={`Spoonjoy | ${recipe.title}`}
        description={recipe.description || `${recipe.title} page.`}
        ogUrl={`${website}/${recipe.id}`}
        ogContentUrl={`https://images.spoonjoy.app/api/recipe?title=${encodeURIComponent(
          recipe.title
        )}&subtitle=${encodeURIComponent(recipe.description || '')}`}
      />
      <HeaderSlot.Plug id="recipe">
        <div
          style={{
            backgroundImage: `url('${recipe.imageUrl}')`,
          }}
          className={`relative m-auto h-[350px] bg-cover bg-bottom sm:h-[400px] md:h-[500px] lg:w-[900px]`}
        >
          <div className="absolute bottom-0 w-full">
            <div className="relative mx-auto mb-4 flex min-h-[140px] w-[350px] flex-col justify-between rounded-md p-4 text-white backdrop-blur backdrop-brightness-50 sm:min-h-[160px] sm:w-[600px] md:mb-6 md:min-h-[170px]">
              {/* Header text */}
              <div>
                <span className="mb-2 block text-base font-bold leading-none tracking-normal opacity-[85%] sm:text-lg md:text-xl md:tracking-wide">
                  {recipe.title}
                </span>
                <span className="block text-sm font-light leading-4 tracking-normal opacity-[85%] sm:text-base md:text-lg">
                  {recipe.description}
                </span>
              </div>
              {/* Chef info */}
              <div className="mt-2 ml-2 flex">
                <img className="h-8 w-8 rounded-full" src={ChefRJ} alt="" />
                <div className="pl-2">
                  <span className="block text-xs font-thin opacity-[80%]">
                    Recipe by:
                  </span>
                  <span className="block text-sm font-normal leading-none">
                    {recipe.chef.username}
                  </span>
                </div>
                <div>Add to cookbook</div>
              </div>
            </div>
          </div>
        </div>
      </HeaderSlot.Plug>
      <div className="my-6 flex justify-center">
        <ReloadIngredientsItemsList
          label={'Clear Progress'}
          itemIds={listItemIds}
        />
      </div>

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
      {isOwnRecipe && <RecipeControlBar recipeId={recipe.id} />}
    </>
  )
}

export default Recipe
