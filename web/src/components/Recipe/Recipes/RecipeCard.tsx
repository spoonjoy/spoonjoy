import { FindCookbooksForDropdown, RecipeShortInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import AddToCookbookButton from 'src/components/Cookbook/AddToCookbook/AddToCookbookButton'
import AddToCookbookButtonCell from 'src/components/Cookbook/AddToCookbookButtonCell'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'

const RecipeCard = ({
  recipe,
  myCookbooks,
}: {
  recipe?: RecipeShortInfo
  myCookbooks?: FindCookbooksForDropdown['myCookbooks'] | null
}) => {
  const { currentUser } = useAuth()
  const addToCookbookBtnWrapper = recipe && (
    <div className="absolute top-5 right-4 z-20">
      {currentUser ? (
        myCookbooks ? (
          <AddToCookbookButton
            currentRecipeId={recipe.id}
            inMyCookbooks={recipe.inMyCookbooks}
            myCookbooks={myCookbooks}
          />
        ) : (
          <AddToCookbookButtonCell
            currentRecipeId={recipe.id}
            inMyCookbooks={recipe.inMyCookbooks}
            username={currentUser.username}
          />
        )
      ) : (
        <AddToCookbookButton currentRecipeId={recipe.id} inMyCookbooks={null} />
      )}
    </div>
  )
  return (
    <ListCardBase
      linkTo={recipe ? routes.recipe({ id: recipe.id }) : '#'}
      linkTitle={recipe ? 'Show recipe ' + recipe.id + ' detail' : 'loading...'}
      childrenOutsideLink={addToCookbookBtnWrapper}
    >
      {recipe && (
        <div className="absolute left-0 top-0 right-0 z-10 flex h-16 rounded-t-lg bg-gradient-to-b from-black to-transparent text-white opacity-70" />
      )}
      <ListCardContentWithImageBackground
        imageUrl={
          recipe?.id &&
          `https://res.cloudinary.com/dpjmyc4uz/image/upload/w_400/${recipe.id}`
        }
        cardTitle={recipe?.title}
        byline={recipe?.chef.username}
        cardSubtitle={recipe?.description}
      />
    </ListCardBase>
  )
}

export default RecipeCard
